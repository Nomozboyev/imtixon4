const basisURL = `http://localhost:3000`;
const TYPE = `/jobs`;
let eljobList = document.querySelector(".jobsList");
let templateJob = document.querySelector(".templateJobs").content;
let jobInfoList = document.querySelector(".jobInfo");
let infoJobTemplate = document.querySelector(".JobInfoTemplate").content;

let elInputJobTitle = document.querySelector("#jobTitle");
let elInputCompanyName = document.querySelector("#companyName");
let elInputSalary = document.querySelector("#salary");
let elInputLocation = document.querySelector("#location");
let elExpect = document.querySelector("#expect");
let elOffer = document.querySelector("#offer");
let elSkills = document.querySelector("#skills");

let elsearchForm = document.querySelector(".searchForm");
let elSearchInput = document.querySelector(".searchInput");

let elFormAddJobs = document.querySelector("#elFormAddJobs");

let allJobs = [];
async function backentAnswer(path, options) {
  let request = await fetch(`${basisURL}${path}`, options);
  let alljobs = await request.json();
  return alljobs;
}
async function getJobs() {
  let job = await backentAnswer(TYPE, { method: "GET" });
  renderJobs(job);
  eljobList.append(templateJob.cloneNode(true))
  allJobs = job;
  console.log(job);
}
function renderJobs(err) {
  eljobList.innerHTML=null
  err.forEach((element) => {
    let jobTitle = templateJob.cloneNode(true);
    
    let companyName = jobTitle.querySelector(".Company");
    let eljob_title = jobTitle.querySelector(".jobTitle");
    let locationCompay = jobTitle.querySelector(".location");
    let salaryJob = jobTitle.querySelector(".salary");
    let elLi = jobTitle.querySelector(".elLi");
    
    elLi.dataset.id = element.id;
    companyName.textContent = element.company;
    eljob_title.textContent = element.job_title;
    locationCompay.textContent = element.location;
    salaryJob.textContent = element.salary;
    
    eljobList.appendChild(jobTitle);
  });
}
elFormAddJobs.addEventListener("submit", addJobs);
async function addJobs(event) {
  event.preventDefault();
  await backentAnswer(TYPE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      job_title: elInputJobTitle.value.trim(),
      salary: elInputSalary.value.trim(),
      company: elInputCompanyName.value.trim(),
      location: elInputLocation.value.trim(),
      what_we_expect: elExpect.value.trim(),
      what_we_offer: elOffer.value.trim(),
      skills: elSkills.value.trim(),
    }),
  });
}
function onDelete(id) {
  backentAnswer(`${TYPE}/${id}`, { method: "DELETE" });
}
jobInfoList.append(jobInfo = infoJobTemplate.cloneNode(true))

function onMore(id) {
  let fountedJob = allJobs.find((job) => job.id === id - 0);

  let jobInfo = infoJobTemplate.cloneNode(true);
  let jobInfoTitle = jobInfo.querySelector(".jobInfoTitle");
  let jobInfoSalary = jobInfo.querySelector(".jobInfoSalary");
  let jobInfoCompany = jobInfo.querySelector(".jobInfoCompany");
  let jobInfoLocation = jobInfo.querySelector(".jobInfoLocation");
  let jobInfoExpect = jobInfo.querySelector(".jobInfoExpect");
  let jobInfoOffer = jobInfo.querySelector(".jobInfoOffer");
  jobInfoTitle.textContent = fountedJob.job_title;
  jobInfoSalary.textContent = fountedJob.salary;
  jobInfoCompany.textContent = fountedJob.company;
  jobInfoLocation.textContent = fountedJob.location;
  jobInfoExpect.textContent = fountedJob.what_we_expect;
  jobInfoOffer.textContent = fountedJob.what_we_offer;
  jobInfoList.innerHTML = null;
  jobInfoList.append(jobInfo);
}
function onClick(event) {
  if (event.target.matches("#deleteBtn")) {
    let deleteId = event.target.closest("li").dataset.id;
    console.log(deleteId);
    return onDelete(deleteId);
  } else if (event.target.matches("#More")) {
    let onMoreID = event.target.closest("li").dataset.id;

    onMore(onMoreID);
  }
}
eljobList.addEventListener("click", onClick);

function onSearch(event) {
  event.preventDefault();
  let searchValue = elSearchInput.value.trim();
  if (!searchValue) {
    return alert("Input some value");
  }
  let regex = new RegExp(searchValue, "gi");
  let searchJobsArr = [];
  allJobs.forEach((element) => {
    if (element.job_title.match(regex)) {
      return searchJobsArr.push(element);
    }
    // else {return getJobs() }
  });
  renderJobs(searchJobsArr)
}
elsearchForm.addEventListener("submit", onSearch);

getJobs();

