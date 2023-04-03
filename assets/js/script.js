// *** random user api : start *** //

const userLists = document.querySelector(".users__lists");
const usersWrapper = document.querySelector(".users__wrapper");
const baseApi = "https://randomuser.me/api/?results=200";

const showUser = (users) => {
  const userData = users.map(user => {
    return user;
  });
  
  const yearArr = [];
  const monthArr = [];

  userData.forEach(user => {
    const { email, gender, name: {first, last}, picture: {large}, dob: {date} } = user;

    const fHyphen = date.indexOf('-');
    const lHyphen = date.lastIndexOf('-');
    const year = date.slice(0,4);
    const month = date.slice(fHyphen+1,fHyphen+3);
    const day = date.slice(lHyphen+1,lHyphen+3);

    if(yearArr.indexOf(year) == -1) yearArr.push(year);
    if(monthArr.indexOf(year) == -1) monthArr.push(month);
    yearArr.sort();
    monthArr.sort();
    
    const li = document.createElement("li");
    li.classList.add("users__lists--item");
    li.setAttribute('data-user-month', month);
    li.setAttribute('data-user-year', year);
  
    li.innerHTML = `
      <figure class="user__img">
      <img src="${large}" alt="user img">
      </figure>
      <div class="user__details">
        <span class="user__name">Name : ${first} ${last}</span>
        <span class="user__gender">Gender : ${gender}</span>
        <span class="user__email">Email : ${email}</span>
        <span class="user__dob">DOB : ${day}-${month}-${year}</span>
      </div>
      `;

    userLists.append(li);
  });

  if(yearArr.length != 0) {
    setCustomSelect(yearArr);
  }
}

const getUser = async () => {
  try {
    const response = await fetch(baseApi);
    const finalResult = await response.json();
    return showUser(finalResult.results);
  } catch (error) {
    console.log("fetch error!");
  }
}

getUser();

// *** random user api : end *** //

// *** birthday calender : start *** //

const birthdayCalender = document.querySelector('.birthday__calender');
const allMonths = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"]

allMonths.forEach((month, index) => {
  const li = document.createElement("li");
  li.classList.add("calender__item");
  li.setAttribute('data-calender-month', ((index < 9) ? ("0"+(index+1)) : (index+1)));
  li.setAttribute('data-calender-monthname', month);
  li.innerHTML = `
    <h4 class="calender__heading">${month}</h4>
    <div class="calender__user"></div>
  `;
  birthdayCalender.append(li);
})

// *** birthday calender : end *** //

// *** custom select : start *** //

const selectedBox = document.querySelector('.selected__box');
const selectLists = document.querySelector('.select__lists');
const selected = document.querySelector('.selected');

const setCustomSelect = (yearArray) => {
  yearArray.forEach(year => {
    const li = document.createElement("li");
    li.classList.add("select__lists--item");
    li.innerHTML = year;
    selectLists.append(li);
  })
  
  selectedBox.addEventListener('click', e => {
    e.target.classList.toggle('active');
    selectLists.classList.toggle('active');
    selectedBox.classList.toggle('active');
  })
  
  const selectListItem = document.getElementsByClassName('select__lists--item');
  const birthdayCalenderItem = birthdayCalender.querySelectorAll(".calender__item");
  const birthdayCalenderUser = birthdayCalender.querySelectorAll(".calender__user");
  
  selectLists.addEventListener('click', e => {

    for(let item of selectListItem) {
      item.classList.remove('active');
    }

    for (let userBox of birthdayCalenderUser) {
      userBox.innerHTML = '';
    }
  
    let datasetVal = selected.dataset.yearBirth;
    datasetVal = e.target.innerText;
    selected.innerText = datasetVal;
    e.target.classList.add('active');
    e.currentTarget.classList.remove('active');
    selectedBox.classList.remove('active');
    
    if(datasetVal != '') {
      const userListItems = userLists.children;
      const visibleListArray = [];

      for(let i=0; i<userListItems.length; i++) {
        const listYear = userListItems[i].dataset.userYear;

        if (datasetVal == listYear) {
          userListItems[i].style.display = "";
          visibleListArray.push(userListItems[i]);
        } else {
          userListItems[i].style.display = "none";
        }
      }

      visibleListArray.forEach((vList) => {
        const listMonth = vList.dataset.userMonth;
        const userName = vList.querySelector(".user__name").innerText;
        const userDOB = vList.querySelector(".user__dob").innerText;

        birthdayCalenderItem.forEach((cList, idx) => {
          const monthCalender = cList.dataset.calenderMonth;

          if (monthCalender == listMonth) {
            birthdayCalenderUser[idx].innerHTML += `
              <div class="calender__user--box">
                <h5 class="calender__user--name">${userName}</h5>
                <h5 class="calender__user--dob">${userDOB}</h5>
              </div>
            `;
          }
        })
      })
    }
  })
}

// *** custom select : end *** //