
document.getElementById("logoutButton").addEventListener("click", () => {
  fetch("/logout", { method: "POST" })
    .then((response) => {
      if (response.ok) window.location.href = "/";
      else alert("Lỗi đăng xuất!");
    })
    .catch((e) => { alert("Lỗi đăng xuất!"); });
});

function toggleSIDE() {
  document.querySelector(".sidebar").classList.toggle("cc");
  document.querySelector(".article").classList.toggle("cc");
};


const imageSourceSelect = document.getElementById("image-source");
const imageUpload = document.getElementById("image-upload");
const imageWeb = document.getElementById("image-web");
const imagePreview = document.getElementById("preview-image-src");
const imageWebSelect = document.getElementById("imageweb");

imageSourceSelect.addEventListener("change", () => {
  const selectedValue = imageSourceSelect.value;
  imageUpload.style.display = "none";
  imageWeb.style.display = "none";
  if (selectedValue === "upload") {
    imageUpload.style.display = "block";
    iu(document.querySelector('input[name="image-upload"]'));
  } else if (selectedValue === "web") {
    imagePreview.src = `../img/bookic/${imageWebSelect.value}`
    imageWeb.style.display = "block";
  }
  else imagePreview.src = `../img/bookic/${imageSourceSelect.value}`
});
function iu(t) {
  const file = t.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imagePreview.src = "#";
    // imagePreview.style.display = "none";
  }
}
document.querySelector('input[name="image-upload"]').addEventListener("change", function (event) {
  iu(event.target);
});
imageWebSelect.addEventListener("change", () => {
  imagePreview.src = `../img/bookic/${imageWebSelect.value}`;
});