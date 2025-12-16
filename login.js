const kakaoLoginButton = document.querySelector("#kakao");
const naverLoginButton = document.querySelector("#naver");

const userImage = document.querySelector("img");
const userName = document.querySelector("#user_name");
const logoutButton = document.querySelector("#logout_btn");

function renderUserInfo(imgUrl, name) {
  userImage.src = imgUrl;
  userName.textContent = name;
}

const kakaoClientId = "59dab6a3c5c33535824946315024caae";
const redirectURI = "http://127.0.0.1:5500";
let kakaoAccessToken = "";

kakaoLoginButton.onclick = () => {
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoClientId}&redirect_uri=${redirectURI}&response_type=code`;
};

logoutButton.onclick = () => {
  axios
    .delete("http://localhost:3000/kakao/logout", {
      data: { kakaoAccessToken },
    })
    .then((res) => {
      renderUserInfo("", "");
    });
};

window.onload = () => {
  const url = new URL(location.href);
  const urlParams = url.searchParams;
  const authorizationCode = urlParams.get("code");

  axios
    .post("http://localhost:3000/kakao/login", {
      authorizationCode,
    })
    .then((res) => {
      kakaoAccessToken = res.data;
      axios
        .post("http://localhost:3000/kakao/userInfo", {
          kakaoAccessToken,
        })
        .then((res) =>
          renderUserInfo(res.data.profile_image, res.data.nickname)
        );
    });
};
