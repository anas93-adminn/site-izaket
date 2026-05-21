const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
}

fetch("https://site-izaket.onrender.com/profile", {
  method: "GET",
  headers: {
    Authorization: "Bearer " + token
  }
})
.then(res => res.json())
.then(data => {

  console.log("USER CONNECTÉ :", data);

  const title = document.createElement("h2");
  title.textContent = `Bienvenue ${data.user.email}`;
  document.body.appendChild(title);

})
.catch(err => {
  console.error(err);
  window.location.href = "login.html";
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}); 