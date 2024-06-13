// scripts.js

const tempStore = {
  ko: {
    placeName: "장소 이름",
    menuCategory: "메뉴 카테고리",
    tel: "전화번호",
    address: "주소",
    openHours: "영업 시간",
    editorialSummary: "편집 요약",
    recommand: "추천 음식",
    menus: [],
    tab_place: "장소소개",
    tab_menu: "메뉴",
    tab_map: "지도",
    button: "맛남 만들기",
    title: "입맛취저 친구들과, 부담없는 맛집여행!",
    description: `가끔은, 근처 친구들과 식사나 커피도 낭만있지 않을까 생각했어요!<br />
    그래서 맛남을 만들었고, 여러분의 의견을 기다립니다.<br />
    맛집도 같이가고, 입맛 맞는 친구들도 만들어봐요!<br /><br />
    외국 친구들과 맛난 식사도 가능!<br />동네 & 해외 맛친 모두 함께하는, 맛남`,
  },
  en: {
    placeName: "Place Name",
    menuCategory: "Menu Category",
    tel: "Telephone",
    address: "Address",
    openHours: "Opening Hours",
    editorialSummary: "Editorial Summary",
    recommand: "Recommended Food",
    menus: [],
    tab_place: "Place",
    tab_menu: "Menu",
    tab_map: "Map",
    button: "Join MealMeet",
    title: "Meetup for Foodies Worldwide",
    description: `Could liking the same foods spark more joyful connections?<br />
With Us, it's about shared moments<br />
After all, great friendships often begin with nice drink and food<br /><br />
Now, start by sharing your favourite menu<br />
A delightful bond begins from a tasty moment<br />
The beginning of a tasty friendship, MealMeet`,
  },
};

const openTab = (event, tabName) => {
  // Get all elements with class="tabcontent" and hide them
  const tabcontent = document.querySelectorAll(".tabcontent");
  tabcontent.forEach((content) => {
    content.style.display = "none";
    content.classList.remove("active");
  });

  // Get all elements with class="tablink" and remove the class "active"
  const tablinks = document.querySelectorAll(".tablink");
  tablinks.forEach((link) => {
    link.classList.remove("active");
  });

  // Show the current tab, and add an "active" class to the button that opened the tab
  const currentTab = document.getElementById(tabName);
  currentTab.style.display = "block";
  currentTab.classList.add("active");
  event.currentTarget.classList.add("active");
};

const switchLang = (button, lang) => {
  // 모든 버튼에서 active 클래스 제거
  const buttons = document.querySelectorAll(".lang-button");
  buttons.forEach((btn) => btn.classList.remove("active"));

  // 클릭한 버튼에 active 클래스 추가
  button.classList.add("active");

  // 언어 변경
  const elements = document.querySelectorAll("[data-translate]");
  elements.forEach((el) => {
    const key = el.getAttribute("data-translate");

    if (key === "editorialSummary") {
      el.textContent = `"${tempStore[lang][key]}"`;
    } else if (key === "openHours") {
      el.innerHTML = tempStore[lang][key].map((hour) => `${hour}<br>`).join("");
    } else {
      el.textContent = tempStore[lang][key];
    }
  });

  // 메뉴 리스트 변경
  const menuList = document.getElementById("menuList");
  menuList.innerHTML = "";

  const menus = lang === "ko" ? tempStore.ko.menus : tempStore.en.menus;
  if (menus && menus.length > 0) {
    menus.forEach((menu) => {
      const menuItem = document.createElement("li");
      menuItem.className = "menu-item";

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = menu.name;

      const price = document.createElement("div");
      price.className = "price";
      price.textContent = `₩${menu.price}`;

      menuItem.appendChild(name);
      menuItem.appendChild(price);
      menuList.appendChild(menuItem);
    });
  }

  // 지도 및 InfoWindow 언어 변경
  const placeName =
    lang === "ko" ? tempStore.ko.placeName : tempStore.en.placeName;
  const address = lang === "ko" ? tempStore.ko.address : tempStore.en.address;

  const latitude = tempStore.latitude;
  const longitude = tempStore.longitude;

  initMap(latitude, longitude, placeName, address);
};

const switchLangStaticContent = (button, lang) => {
  const title = tempStore[lang].title;
  const description = tempStore[lang].description;

  const elements = document.querySelectorAll("[static-translate]");
  elements.forEach((el) => {
    const key = el.getAttribute("static-translate");

    if (key === "title") {
      el.textContent = title;
    } else if (key === "description") {
      el.innerHTML = description;
    }
  });
};

// Google Maps 초기화 함수
const initMap = async (lat, lng, placeName, address) => {
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement, PinElement, InfoWindow } =
    await google.maps.importLibrary("marker");

  const position = { lat: lat, lng: lng };

  map = new Map(document.getElementById("map"), {
    center: position,
    zoom: 17,
    mapId: "METNAM_CONTENT_MAP",
  });

  // 마커를 지도에 추가
  const marker = new google.maps.marker.AdvancedMarkerElement({
    map,
    position: position,
    title: placeName,
  });

  const infowindow = new google.maps.InfoWindow({
    content: `<div><h3>${placeName}</h3><p>${address}</p></div>`,
  });

  // 마커 클릭 이벤트 추가
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });

  infowindow.open(map, marker);
};

// Default to open the first tab
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".tablink").click();
  fetchData();
});

const extractVideoId = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// Add horizontal scrolling with mouse drag
const scrollContainer = document.querySelector(".scroll-container");
let isDown = false;
let startX;
let scrollLeft;

scrollContainer.addEventListener("mousedown", (e) => {
  isDown = true;
  scrollContainer.classList.add("active");
  startX = e.pageX - scrollContainer.offsetLeft;
  scrollLeft = scrollContainer.scrollLeft;
});

scrollContainer.addEventListener("mouseleave", () => {
  isDown = false;
  scrollContainer.classList.remove("active");
});

scrollContainer.addEventListener("mouseup", () => {
  isDown = false;
  scrollContainer.classList.remove("active");
});

scrollContainer.addEventListener("mousemove", (e) => {
  if (!isDown) return;
  e.preventDefault();
  const x = e.pageX - scrollContainer.offsetLeft;
  const walk = (x - startX) * 3; //scroll-fast
  scrollContainer.scrollLeft = scrollLeft - walk;
});

scrollContainer.addEventListener("wheel", (e) => {
  e.preventDefault();
  scrollContainer.scrollLeft += e.deltaY;
});

const fetchData = async () => {
  try {
    const response = await fetch("http://192.168.123.109:1337/v2/places/2699"); // 여기에 실제 API URL을 입력하세요.
    const data = await response.json();

    console.log("data", data);

    const placeNameKo = data.info.ko.placeName;
    const placeNameEn = data.info.en.placeName;

    const menuCategoryKo = data.info.ko.type;
    const menuCategoryEn = data.info.en.type;

    const openHoursKo = data.info.ko.openHours;
    const openHoursEn = data.info.en.openHours;

    const addressKo = data.info.ko.address;
    const addressEn = data.info.en.address;

    const editorialSummaryKo = data.info.ko.editorialSummary;
    const editorialSummaryEn = data.info.en.editorialSummary;

    const recommandsKo = data.info.ko.recommandFood;
    const recommandsEn = data.info.en.recommandFood;

    const menusKo = data.info.ko.menus;
    const menusEn = data.info.en.menus;

    const images = data.info.photos;
    const latitude = data.latitude;
    const longitude = data.longitude;
    const tel = data.info.tel;
    const youtubeUrl = data.info.youtube_url;
    const yotubeVideoId = extractVideoId(youtubeUrl);

    tempStore.ko.placeName = placeNameKo;
    tempStore.en.placeName = placeNameEn;

    tempStore.ko.menuCategory = menuCategoryKo;
    tempStore.en.menuCategory = menuCategoryEn;

    tempStore.ko.openHours = openHoursKo;
    tempStore.en.openHours = openHoursEn;

    tempStore.ko.address = addressKo;
    tempStore.en.address = addressEn;

    tempStore.ko.editorialSummary = editorialSummaryKo;
    tempStore.en.editorialSummary = editorialSummaryEn;

    tempStore.ko.recommand = recommandsKo;
    tempStore.en.recommand = recommandsEn;

    tempStore.ko.menus = menusKo;
    tempStore.en.menus = menusEn;

    tempStore.latitude = latitude;
    tempStore.longitude = longitude;

    /** 첫번째 탭 처리 */
    document.getElementById("placeName").textContent = placeNameKo;
    document.getElementById("menuCategory").textContent = menuCategoryKo;
    document.getElementById("address").textContent = addressKo;
    document.getElementById(
      "editorialSummary"
    ).textContent = `"${editorialSummaryKo}"`;

    if (tel) {
      document.getElementById("tel").textContent = tel;
    } else {
      document.querySelector(".info-item.phone").style.display = "none";
    }

    if (openHoursKo.length > 0) {
      document.getElementById("openHours").innerHTML = openHoursKo
        .map((hour) => `${hour}<br>`)
        .join("");
    } else {
      document.querySelector(".info-item.open-hours").style.display = "none";
    }

    if (recommandsKo) {
      document.getElementById("recommand").textContent = recommandsKo;
    } else {
      document.querySelector(".info-item.recommand").style.display = "none";
    }

    const scrollItem = document.createElement("div");
    scrollItem.className = "scroll-item";

    const aspectRatio = document.createElement("div");
    aspectRatio.className = "aspect-ratio";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${yotubeVideoId}`;
    iframe.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    aspectRatio.appendChild(iframe);
    scrollItem.appendChild(aspectRatio);
    scrollContainer.appendChild(scrollItem);

    images.forEach((url) => {
      const scrollItem = document.createElement("div");
      scrollItem.className = "scroll-item";

      const aspectRatio = document.createElement("div");
      aspectRatio.className = "aspect-ratio";

      const img = document.createElement("img");
      img.src = url;
      img.alt = "Image";
      aspectRatio.appendChild(img);

      scrollItem.appendChild(aspectRatio);
      scrollContainer.appendChild(scrollItem);
    });

    /** 2번째 탭 처리 */
    const tab2Link = document.querySelector(".tablink:nth-child(2)");
    const tab2Content = document.getElementById("Tab2");
    const menuList = document.getElementById("menuList");

    if (menusKo && menusKo.length > 0) {
      menusKo.forEach((menu) => {
        const menuItem = document.createElement("div");
        menuItem.className = "menu-item";

        const name = document.createElement("div");
        name.className = "name";
        name.textContent = menu.name;

        const price = document.createElement("div");
        price.className = "price";
        price.textContent = `₩${menu.price}`;

        menuItem.appendChild(name);
        menuItem.appendChild(price);
        menuList.appendChild(menuItem);
      });
    } else {
      tab2Link.style.display = "none";
      tab2Content.style.display = "none";
    }

    /** 세번째 탭 처리 */
    initMap(latitude, longitude, placeNameKo, addressKo);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
