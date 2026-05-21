const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const response = await fetch("http://localhost:3000/register", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        username,
        email,
        password
      })

    });

    const data = await response.json();

    document.getElementById("message").textContent = data.message;

    // Si le compte est créé
    if (response.ok) {

      // Sauvegarder le token
      localStorage.setItem("token", data.token);

      // Redirection vers login
      window.location.href = "/login.html";

    }

  } catch (error) {

    console.log(error);

  }

});