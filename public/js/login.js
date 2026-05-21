console.log("LOGIN JS CHARGÉ");

const form = document.getElementById("loginForm");
const message = document.getElementById("message");



form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {

    const res = await fetch("https://site-izaket.onrender.com/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();
    console.log("REPONSE SERVEUR:", data);

    if (res.ok) {

      // Sauvegarde du token JWT
      localStorage.setItem("token", data.token);
      console.log("LOGIN OK");
      console.log("LOCALSTORAGE =", localStorage.getItem("token"));
      message.style.color = "green";
      message.textContent = "Connexion réussie !";

      // Redirection vers le dashboard
      window.location.href = "dashboard.html";

    } else {

      message.style.color = "red";
      message.textContent = data.message;

    }

  } catch (error) {

    console.error(error);

    message.style.color = "red";
    message.textContent = "Erreur serveur";

  }

});

