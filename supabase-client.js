(function () {
  const config = window.SUPABASE_CONFIG || {};
  const supabaseGlobal = window.supabase;
  const OAUTH_PENDING_KEY = "sapas-oauth-pending";
  const ADMIN_PAGE_SIZE = 1000;
  const projectRef = (() => {
    try {
      return new URL(config.url).hostname.split(".")[0] || "sapas";
    } catch (error) {
      return "sapas";
    }
  })();
  const AUTH_STORAGE_KEY = `sb-${projectRef}-auth-token`;

  function isConfigured() {
    return Boolean(config.url && config.anonKey && supabaseGlobal && typeof supabaseGlobal.createClient === "function");
  }

  function hasServiceRole() {
    return Boolean(config.serviceRoleKey);
  }

  function createFallbackClient() {
    return {
      isConfigured,
      init() {
        return false;
      },
      async getSession() {
        return null;
      },
      onAuthStateChange() {
        return {
          data: {
            subscription: {
              unsubscribe() {}
            }
          }
        };
      },
      isOAuthRedirectPending() {
        return false;
      }
    };
  }

  function setOAuthPending(value) {
    try {
      window.localStorage.removeItem(OAUTH_PENDING_KEY);
      if (value) window.sessionStorage.setItem(OAUTH_PENDING_KEY, "google");
      else window.sessionStorage.removeItem(OAUTH_PENDING_KEY);
    } catch (error) {
      console.warn("OAuth pending flag could not be updated:", error);
    }
  }

  function isOAuthPending() {
    try {
      const currentUrl = new URL(window.location.href);
      const hash = String(window.location.hash || "").replace(/^#/, "");
      const hashParams = new URLSearchParams(hash);
      return window.sessionStorage.getItem(OAUTH_PENDING_KEY) === "google"
        || currentUrl.searchParams.has("code")
        || hashParams.has("access_token")
        || hashParams.has("refresh_token");
    } catch (error) {
      return false;
    }
  }

  function clearPersistedSession() {
    try {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return true;
    } catch (error) {
      return false;
    }
  }

  async function finalizeOAuthRedirect() {
    const currentUrl = new URL(window.location.href);
    const authCode = currentUrl.searchParams.get("code");
    if (!authCode) return null;

    const { data, error } = await client.auth.exchangeCodeForSession(authCode);
    if (error) {
      setOAuthPending(false);
      throw new Error(toFriendlyAuthError(error, "Unable to finish Google sign-in."));
    }

    currentUrl.searchParams.delete("code");
    currentUrl.searchParams.delete("state");
    currentUrl.searchParams.delete("scope");
    currentUrl.searchParams.delete("authuser");
    currentUrl.searchParams.delete("prompt");
    window.history.replaceState({}, document.title, `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`);
    setOAuthPending(false);
    return data && data.session ? data.session : null;
  }

  async function finalizeOAuthHashRedirect() {
    const hash = window.location.hash ? window.location.hash.replace(/^#/, "") : "";
    if (!hash) return null;
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (!accessToken || !refreshToken) return null;

    const { data, error } = await client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    });
    if (error) {
      setOAuthPending(false);
      throw new Error(toFriendlyAuthError(error, "Unable to finish Google sign-in."));
    }

    window.history.replaceState({}, document.title, `${window.location.pathname}${window.location.search}`);
    setOAuthPending(false);
    return data && data.session ? data.session : null;
  }

  function toFriendlyAuthError(error, fallbackMessage) {
    const sourceMessage = error && error.message ? String(error.message) : "";
    if (/unsupported provider/i.test(sourceMessage) || /provider is not enabled/i.test(sourceMessage)) {
      return "Google sign-in is not enabled in your Supabase project yet. Enable Google under Authentication > Providers.";
    }
    if (/email not confirmed/i.test(sourceMessage)) {
      return "This account exists, but Supabase still marks the email as unconfirmed. Enable email delivery or turn off Confirm email in Supabase Authentication > Providers > Email.";
    }
    if (/invalid login credentials/i.test(sourceMessage)) {
      return "This account is not created yet, or the password is incorrect. Create an account first using Sign Up.";
    }
    if (/user already registered/i.test(sourceMessage) || /already been registered/i.test(sourceMessage)) {
      return "This email is already registered. Use Sign In instead.";
    }
    if (/email rate limit exceeded/i.test(sourceMessage)) {
      return "Too many email requests were made. Please wait a moment and try again.";
    }
    return sourceMessage || fallbackMessage || "Authentication could not be completed right now.";
  }

  function unwrapSingleRow(data) {
    return Array.isArray(data) ? data[0] || null : data || null;
  }

  function isUuid(value) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || "").trim());
  }

  function ensureUuid(value) {
    const normalized = String(value || "").trim();
    if (isUuid(normalized)) return normalized;
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (char) {
      const random = Math.random() * 16 | 0;
      const next = char === "x" ? random : (random & 0x3 | 0x8);
      return next.toString(16);
    });
  }

  function sanitizeStudentForCloud(student) {
    const payload = student && typeof student === "object" ? JSON.parse(JSON.stringify(student)) : {};
    payload.id = ensureUuid(payload.id);
    return payload;
  }

  function normalizeEmail(email) {
    return String(email || "").trim().toLowerCase();
  }

  if (!isConfigured()) {
    window.SapasSupabase = createFallbackClient();
    return;
  }

  const client = supabaseGlobal.createClient(config.url, config.anonKey, {
    auth: {
      storageKey: AUTH_STORAGE_KEY,
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  });

  async function fetchAuthSettings() {
    const response = await fetch(`${config.url}/auth/v1/settings`, {
      method: "GET",
      headers: {
        apikey: config.anonKey
      }
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.msg || payload.error_description || payload.error || payload.message || "Unable to load auth settings.";
      throw new Error(message);
    }
    return payload;
  }

  async function passwordCombinationExists(email, password) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail || !password) return false;

    const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password
      })
    });

    if (response.ok) return true;

    const payload = await response.json().catch(() => ({}));
    const message = String(payload.msg || payload.error_description || payload.error || payload.message || "");
    if (/email not confirmed/i.test(message) && hasServiceRole()) {
      const existingUser = await findAdminUserByEmail(normalizedEmail);
      return Boolean(existingUser && existingUser.id);
    }
    return false;
  }

  async function emailAccountExists(email) {
    const normalizedEmail = normalizeEmail(email);
    if (!normalizedEmail) return false;

    if (hasServiceRole()) {
      const profileLookup = await fetch(`${config.url}/rest/v1/profiles?select=id&email=eq.${encodeURIComponent(normalizedEmail)}&limit=1`, {
        method: "GET",
        headers: {
          apikey: config.serviceRoleKey,
          Authorization: `Bearer ${config.serviceRoleKey}`
        }
      });
      if (profileLookup.ok) {
        const profilePayload = await profileLookup.json().catch(() => []);
        if (Array.isArray(profilePayload) && profilePayload.length > 0) {
          return true;
        }
      }
      const existingUser = await findAdminUserByEmail(normalizedEmail);
      return Boolean(existingUser && existingUser.id);
    }

    const response = await fetch(`${config.url}/auth/v1/signup`, {
      method: "POST",
      headers: {
        apikey: config.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: normalizedEmail,
        password: "123456"
      })
    });

    const payload = await response.json().catch(() => ({}));
    const message = String(payload.msg || payload.error_description || payload.error || payload.message || "");
    return /already been registered|user already registered/i.test(message);
  }

  async function adminRequest(path, options) {
    if (!hasServiceRole()) {
      throw new Error("Supabase service role key is missing.");
    }
    const response = await fetch(`${config.url}${path}`, {
      method: options && options.method ? options.method : "GET",
      headers: Object.assign({
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json"
      }, options && options.headers ? options.headers : {}),
      body: options && options.body !== undefined ? JSON.stringify(options.body) : undefined
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload.msg || payload.error_description || payload.error || payload.message || "Supabase admin request failed.";
      throw new Error(String(message));
    }
    return payload;
  }

  async function listAdminUsers() {
    const payload = await adminRequest(`/auth/v1/admin/users?page=1&per_page=${ADMIN_PAGE_SIZE}`, {
      method: "GET"
    });
    return Array.isArray(payload.users) ? payload.users : [];
  }

  async function findAdminUserByEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    const users = await listAdminUsers();
    return users.find((user) => normalizeEmail(user.email) === normalizedEmail) || null;
  }

  async function confirmAdminUser(userId) {
    return adminRequest(`/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      body: {
        email_confirm: true
      }
    });
  }

  async function updateAdminUser(userId, payload) {
    return adminRequest(`/auth/v1/admin/users/${userId}`, {
      method: "PUT",
      body: payload || {}
    });
  }

  function userHasGoogleProvider(user) {
    if (!user || typeof user !== "object") return false;
    const identities = Array.isArray(user.identities) ? user.identities : [];
    if (identities.some((identity) => String(identity.provider || "").toLowerCase() === "google")) return true;
    const provider = user.app_metadata && user.app_metadata.provider ? String(user.app_metadata.provider).toLowerCase() : "";
    return provider === "google";
  }

  async function createConfirmedAdminUser(email, password) {
    return adminRequest("/auth/v1/admin/users", {
      method: "POST",
      body: {
        email: normalizeEmail(email),
        password,
        email_confirm: true,
        user_metadata: {
          role: "student"
        },
        app_metadata: {
          provider: "email",
          role: "student"
        }
      }
    });
  }

  async function upsertProfileForUser(user) {
    if (!user || !user.id) return null;
    const upsertResponse = await fetch(`${config.url}/rest/v1/profiles?on_conflict=id`, {
      method: "POST",
      headers: {
        apikey: config.serviceRoleKey,
        Authorization: `Bearer ${config.serviceRoleKey}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=representation"
      },
      body: JSON.stringify([{
        id: user.id,
        email: normalizeEmail(user.email || ""),
        role: "teacher"
      }])
    });
    const payload = await upsertResponse.json().catch(() => ([]));
    if (!upsertResponse.ok) {
      const message = Array.isArray(payload) ? "Unable to create profile row." : (payload.message || payload.error || "Unable to create profile row.");
      throw new Error(message);
    }
    return Array.isArray(payload) ? payload[0] || null : payload;
  }

  async function runRpc(name, args, fallbackMessage) {
    const { data, error } = await client.rpc(name, args || {});
    if (error) {
      throw new Error(error.message || fallbackMessage || "Supabase request failed.");
    }
    return data;
  }

  async function ensureProfileRow() {
    const { data: userData, error: userError } = await client.auth.getUser();
    if (userError) {
      throw new Error(toFriendlyAuthError(userError, "Unable to load your user profile."));
    }
    const user = userData && userData.user ? userData.user : null;
    if (!user) return null;

    try {
      const ensuredProfile = unwrapSingleRow(await runRpc("ensure_profile", {}, "Unable to prepare your profile."));
      if (hasServiceRole() && ensuredProfile && ensuredProfile.id && ensuredProfile.role !== "teacher" && ensuredProfile.role !== "admin") {
        await upsertProfileForUser({
          id: ensuredProfile.id,
          email: ensuredProfile.email || user.email || ""
        });
        return {
          ...ensuredProfile,
          role: "teacher"
        };
      }
      return ensuredProfile;
    } catch (rpcError) {
      const profilePayload = {
        id: user.id,
        email: user.email || "",
        role: "teacher"
      };

      const upsertResult = await client
        .from("profiles")
        .upsert(profilePayload, { onConflict: "id" })
        .select("id, email, role")
        .single();

      if (upsertResult.error) {
        throw new Error(toFriendlyAuthError(upsertResult.error, "Unable to create your profile row."));
      }
      return upsertResult.data || profilePayload;
    }
  }

  window.SapasSupabase = {
    client,
    auth: client.auth,
    from: client.from.bind(client),
    rpc: client.rpc.bind(client),
    isConfigured,
    async init() {
      const hashSession = await finalizeOAuthHashRedirect();
      if (hashSession) return hashSession;
      return finalizeOAuthRedirect();
    },
    async getSession() {
      const { data, error } = await client.auth.getSession();
      if (error) {
        throw new Error(toFriendlyAuthError(error, "Unable to load your session."));
      }
      const session = data && data.session ? data.session : null;
      if (session) setOAuthPending(false);
      return session;
    },
    onAuthStateChange(callback) {
      return client.auth.onAuthStateChange((eventName, session) => {
        if (session) setOAuthPending(false);
        if (eventName === "SIGNED_OUT") setOAuthPending(false);
        callback(eventName, session || null);
      });
    },
    async signInWithPassword(email, password) {
      const normalizedEmail = normalizeEmail(email);
      let attempt = await client.auth.signInWithPassword({
        email: normalizedEmail,
        password
      });
      if (attempt.error && /email not confirmed/i.test(String(attempt.error.message || "")) && hasServiceRole()) {
        const existingUser = await findAdminUserByEmail(normalizedEmail);
        if (existingUser && existingUser.id) {
          await confirmAdminUser(existingUser.id);
          attempt = await client.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
        }
      }
      if (attempt.error) {
        if (/invalid login credentials/i.test(String(attempt.error.message || "")) && hasServiceRole()) {
          const existingUser = await findAdminUserByEmail(normalizedEmail);
          if (!existingUser) {
            throw new Error("This account is not created yet. Create an account first using Sign Up.");
          }
          if (userHasGoogleProvider(existingUser)) {
            throw new Error("This account was created with Google. Use Continue with Google to sign in.");
          }
          throw new Error("This account exists, but the password does not match. If this is an older broken account, click Sign Up with the same email to reset it.");
        }
        throw new Error(toFriendlyAuthError(attempt.error, "Unable to sign in."));
      }
      return attempt.data || {};
    },
    async signUpWithPassword(email, password) {
      const normalizedEmail = normalizeEmail(email);
      if (hasServiceRole()) {
        try {
          const createdUser = await createConfirmedAdminUser(normalizedEmail, password);
          await upsertProfileForUser(createdUser);
          return await this.signInWithPassword(normalizedEmail, password);
        } catch (adminError) {
          if (!/already been registered|user already registered/i.test(String(adminError.message || ""))) {
            throw new Error(toFriendlyAuthError(adminError, "Unable to sign up."));
          }
          const existingUser = await findAdminUserByEmail(normalizedEmail);
          if (existingUser && existingUser.id) {
            if (userHasGoogleProvider(existingUser)) {
              throw new Error("This email is already registered through Google. Use Continue with Google to sign in.");
            }
            await updateAdminUser(existingUser.id, {
              password,
              email_confirm: true
            });
            await upsertProfileForUser(existingUser);
            return await this.signInWithPassword(normalizedEmail, password);
          }
        }
      }

      const { data, error } = await client.auth.signUp({
        email: normalizedEmail,
        password
      });
      if (error) {
        throw new Error(toFriendlyAuthError(error, "Unable to sign up."));
      }
      const result = data || {};
      if (result.session) return result;
      try {
        return await this.signInWithPassword(normalizedEmail, password);
      } catch (signInError) {
        return result;
      }
    },
    async checkExistingPasswordAccount(email, password) {
      return passwordCombinationExists(email, password);
    },
    async checkExistingEmailAccount(email) {
      return emailAccountExists(email);
    },
    async signInWithGoogle() {
      setOAuthPending(true);
      const { data, error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}${window.location.pathname}`
        }
      });
      if (error) {
        setOAuthPending(false);
        throw new Error(toFriendlyAuthError(error, "Google sign-in could not start."));
      }
      return data || {};
    },
    async signOut() {
      const { error } = await client.auth.signOut();
      if (error) {
        throw new Error(toFriendlyAuthError(error, "Unable to sign out right now."));
      }
      setOAuthPending(false);
    },
    resetSessionOnOpen() {
      if (isOAuthPending()) return null;
      clearPersistedSession();
      return null;
    },
    clearSessionOnClose() {
      if (isOAuthPending()) return false;
      setOAuthPending(false);
      return clearPersistedSession();
    },
    async getAuthSettings() {
      return fetchAuthSettings();
    },
    async ensureProfile() {
      return ensureProfileRow();
    },
    async fetchStudentRecords() {
      const data = await runRpc("get_accessible_student_records", {}, "Unable to load student records.");
      return Array.isArray(data) ? data : [];
    },
    async upsertStudentRecord(student) {
      return runRpc("upsert_student_record", { payload: sanitizeStudentForCloud(student) }, "Unable to save this student record.");
    },
    async deleteStudentRecord(recordId) {
      return runRpc("delete_student_record", { record_id: recordId }, "Unable to delete this student record.");
    },
    async importStudentRecords(students, filename) {
      return runRpc("import_student_records", {
        payload: Array.isArray(students) ? students.map(sanitizeStudentForCloud) : [],
        source_filename: filename || "students-data.csv"
      }, "Unable to import these student records.");
    },
    isOAuthRedirectPending() {
      return isOAuthPending();
    }
  };
})();
