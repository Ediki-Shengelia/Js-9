let MainPostWraper = document.getElementById("wraper");
let overlay = document.getElementById("overlay");
let closeIcon = document.getElementById("icon");
let contentDiv = document.getElementById("content");

function ajax(url, callback) {
  fetch(url, {
    method: "GET",
  })
    .then(function (response) {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .then(function (mosuliInfoJsPosts) {
      callback(mosuliInfoJsPosts);
    });
}
ajax("https://jsonplaceholder.typicode.com/posts", function (data) {
  data
    .forEach((element) => {
      createPost(element);
    })
    .catch(function (error) {
      console.log(error);
    });
});

function createPost(item) {
  let divEl = document.createElement("div");
  divEl.classList.add("post");
  divEl.setAttribute("data-id", item.id);

  let h3El = document.createElement("h3");
  h3El.innerText = item.id;

  let h2El = document.createElement("h2");
  h2El.textContent = item.title;

  let btnDelete = document.createElement("button");
  btnDelete.setAttribute("deleted-id", item.id);
  btnDelete.innerText = "DELETE";

  divEl.appendChild(h3El);
  divEl.appendChild(h2El);
  divEl.appendChild(btnDelete);

  btnDelete.addEventListener("click", function (e) {
    e.stopPropagation();

    let btnId = this.getAttribute("deleted-id");
    let btnNewUrl = `https://jsonplaceholder.typicode.com/posts/${btnId}`;

    fetch(btnNewUrl, { method: "DELETE" }).then(() => divEl.remove());
  });

  divEl.addEventListener("click", function () {
    overlay.classList.add("active");
    let postId = this.getAttribute("data-id");
    let urlNew = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    ajax(urlNew, function (mosulidata) {
      let p = document.createElement("p");
      p.innerText = mosulidata.body;
      contentDiv.appendChild(p);
    });
  });
  MainPostWraper.appendChild(divEl);
}

closeIcon.addEventListener("click", function () {
  overlay.classList.remove("active");
  contentDiv.innerHTML = "";
});

let addPost = document.getElementById("add-post");
let page = document.getElementById("page");
let formEl = document.getElementById("form");

addPost.addEventListener("click", function () {
  page.classList.add("addactive");
});

formEl.addEventListener("submit", function (el) {
  el.preventDefault();
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      title: el.target[0].value,
      userId: 11,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((createObj) => {
      createPost(createObj);
      page.classList.remove("addactive");
      el.target[0].value = "";
    });
});