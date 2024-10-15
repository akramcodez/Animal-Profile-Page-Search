const btns = document.querySelectorAll("button");
const icons = document.querySelectorAll(".icon-p");
const followBtn = document.querySelector(".follow-btn")

for (let btn of btns) {
  btn.addEventListener("click", () => {
    console.log("button was clicked");
  });
};

for (let icon of icons) {
    icon.addEventListener("click", () => {
      console.log("button was clicked");
    });
};

followBtn.addEventListener("click",function(){
  if(followBtn.innerHTML == "Follow"){
    followBtn.innerHTML = "Following";
  } else {
    followBtn.innerHTML = "Follow";
  }
});

