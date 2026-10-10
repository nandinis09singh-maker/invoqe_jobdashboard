/* CareerFlow shared account display.
 * - Stores the signed-in user in localStorage under "careerflow_user".
 * - Fills [data-user-avatar] with initials and [data-user-name] with the name.
 * - Hides .auth-links (Sign in / Sign up) when signed in.
 * - Never hides the page and never redirects.
 */
(function () {
  var KEY = "careerflow_user";

  function readUser() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return null;
      var user = JSON.parse(raw);
      return user && user.name ? user : null;
    } catch (e) {
      return null;
    }
  }

  function initials(name) {
    var parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    var first = parts[0].charAt(0);
    var last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
    return (first + last).toUpperCase();
  }

  function render() {
    var user = readUser();
    if (!user) return; // signed out: keep the page's default text

    document.querySelectorAll("[data-user-avatar]").forEach(function (el) {
      el.textContent = initials(user.name);
    });

    document.querySelectorAll("[data-user-name]").forEach(function (el) {
      el.textContent = user.name;
    });

    document.querySelectorAll(".auth-links").forEach(function (el) {
      el.style.display = "none";
    });
  }

  // Public helpers for login.html / signup.html / profile.html
  window.CareerFlowAuth = {
    getUser: readUser,
    login: function (name, email) {
      try {
        localStorage.setItem(KEY, JSON.stringify({ name: name, email: email || "" }));
      } catch (e) {}
      render();
    },
    logout: function () {
      try {
        localStorage.removeItem(KEY);
      } catch (e) {}
      location.reload();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
