const STUDENT_KEY = "studentManagementRecords";
const AUDIT_KEY = "studentManagementAudit";
const PAGE_SIZE = 8;
let studentPage = 1;
const sampleCourses = [
  ["SE-301","Web Engineering","Software Engineering",3,4],
  ["SE-302","Software Requirements Engineering","Software Engineering",3,4],
  ["CS-205","Data Structures","Computer Science",4,3],
  ["CS-310","Database Systems","Computer Science",3,5],
  ["IT-220","Computer Networks","Information Technology",3,4],
  ["IT-315","Information Security","Information Technology",2,5]
];
const $ = id => document.getElementById(id);
const esc = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function readStudents(){try{const value=JSON.parse(localStorage.getItem(STUDENT_KEY)||"[]");return Array.isArray(value)?value:[]}catch{return []}}
function saveStudents(records){localStorage.setItem(STUDENT_KEY,JSON.stringify(records))}
function addAudit(message){let log=[];try{log=JSON.parse(localStorage.getItem(AUDIT_KEY)||"[]")}catch{}log.unshift({message,time:new Date().toLocaleString()});localStorage.setItem(AUDIT_KEY,JSON.stringify(log.slice(0,10)))}

function buildChrome(){
  const page=location.pathname.split("/").pop()||"index.html";
  const nav=[["index.html","⌂","Dashboard"],["students.html","♙","Students"],["courses.html","▤","Courses"],["attendance.html","✓","Attendance"],["reports.html","▣","Reports"]];
  const links=nav.map(([href,icon,label])=>`<a class="nav-link ${page===href?"active":""}" href="${href}"><span class="nav-symbol">${icon}</span>${label}</a>`).join("");
  $("appSidebar").innerHTML=`<aside class="sidebar"><div class="brand">Edu<span>Admin</span></div><div class="nav-label">MAIN MENU</div><nav>${links}</nav><div class="nav-label mt-4">SYSTEM</div><a class="nav-link" href="reports.html"><span class="nav-symbol">⚙</span>Reports & Settings</a></aside>`;
  $("appTopbar").innerHTML=`<header class="topbar"><div class="d-flex align-items-center gap-3"><button class="btn btn-outline-secondary btn-sm mobile-menu" data-bs-toggle="offcanvas" data-bs-target="#mobileNav" aria-label="Open menu">☰</button><span class="topbar-title">Education Management System</span></div><div class="d-flex align-items-center gap-2"><span class="small text-secondary d-none d-sm-inline">Administrator</span><span class="user-chip">A</span></div></header>
  <div class="offcanvas offcanvas-start text-bg-dark" tabindex="-1" id="mobileNav"><div class="offcanvas-header"><h5 class="offcanvas-title">EduAdmin</h5><button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button></div><div class="offcanvas-body"><nav class="nav flex-column">${nav.map(([href,icon,label])=>`<a class="nav-link text-white py-3" href="${href}">${icon} &nbsp; ${label}</a>`).join("")}</nav></div></div>`;
}
function buildStudentModal(){
  const mount=$("studentModalMount");if(!mount)return;
  mount.innerHTML=`<div class="modal fade" id="studentModal" tabindex="-1" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content border-0 shadow"><form id="studentForm"><div class="modal-header"><div><h5 class="modal-title" id="studentModalTitle">Add New Student</h5><small class="text-secondary">Enter student information below.</small></div><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><input type="hidden" id="editStudentId"><div class="mb-3"><label class="form-label">Full Name *</label><input class="form-control" id="studentName" required minlength="2" maxlength="60"></div><div class="mb-3"><label class="form-label">Roll Number *</label><input class="form-control" id="studentRoll" required></div><div class="mb-3"><label class="form-label">Email *</label><input class="form-control" id="studentEmail" type="email" required></div><div class="mb-3"><label class="form-label">Department *</label><select class="form-select" id="studentDept" required><option value="">Select department</option><option>Software Engineering</option><option>Computer Science</option><option>Information Technology</option><option>Electrical Engineering</option><option>Business Administration</option></select></div><div class="row g-3"><div class="col-6"><label class="form-label">Semester *</label><select class="form-select" id="studentSem" required><option value="">Select</option>${Array.from({length:8},(_,i)=>`<option value="${i+1}">${i+1}</option>`).join("")}</select></div><div class="col-6"><label class="form-label">Status</label><select class="form-select" id="studentState"><option>Active</option><option>Inactive</option></select></div></div><div id="modalError" class="text-danger small mt-3"></div></div><div class="modal-footer"><button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button type="submit" class="btn btn-primary">Save Student</button></div></form></div></div></div>`;
  $("studentForm").addEventListener("submit",saveStudentFromModal);
  $("studentModal").addEventListener("hidden.bs.modal",resetStudentModal);
}
function alertMessage(message,type="success"){const area=$("alertArea");if(!area)return;area.innerHTML=`<div class="alert alert-${type} alert-dismissible fade show" role="alert">${esc(message)}<button type="button" class="btn-close" data-bs-dismiss="alert"></button></div>`}
function resetStudentModal(){const form=$("studentForm");if(form)form.reset();if($("editStudentId"))$("editStudentId").value="";if($("studentModalTitle"))$("studentModalTitle").textContent="Add New Student";if($("modalError"))$("modalError").textContent=""}
function saveStudentFromModal(event){
  event.preventDefault();const records=readStudents();const id=$("editStudentId").value||String(Date.now());
  const data={id,name:$("studentName").value.trim(),rollNo:$("studentRoll").value.trim(),email:$("studentEmail").value.trim(),department:$("studentDept").value,semester:$("studentSem").value,status:$("studentState").value};
  const error=$("modalError");if(data.name.length<2){error.textContent="Name must have at least 2 characters.";return}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){error.textContent="Enter a valid email address.";return}
  if(records.some(s=>s.rollNo.toLowerCase()===data.rollNo.toLowerCase()&&s.id!==id)){error.textContent="This roll number already exists.";return}
  const index=records.findIndex(s=>s.id===id);
  if(index>=0){records[index]=data;addAudit(`Updated student: ${data.name}`)}else{records.unshift(data);addAudit(`Added student: ${data.name}`)}
  saveStudents(records);bootstrap.Modal.getOrCreateInstance($("studentModal")).hide();alertMessage(index>=0?"Student updated successfully.":"Student added successfully.");renderAll();
}
function openEditStudent(id){
  const s=readStudents().find(x=>x.id===id);if(!s)return;
  $("editStudentId").value=s.id;$("studentName").value=s.name;$("studentRoll").value=s.rollNo;$("studentEmail").value=s.email;$("studentDept").value=s.department;$("studentSem").value=s.semester;$("studentState").value=s.status;$("studentModalTitle").textContent="Edit Student";
  bootstrap.Modal.getOrCreateInstance($("studentModal")).show();
}
function deleteStudent(id){
  const records=readStudents(),s=records.find(x=>x.id===id);if(!s)return;
  if(!confirm(`Delete ${s.name}'s record?`))return;
  saveStudents(records.filter(x=>x.id!==id));addAudit(`Deleted student: ${s.name}`);alertMessage("Student deleted.");renderAll();
}
function studentRow(s,actions=false){return `<tr><td><span class="student-cell">${esc(s.name)}</span><span class="student-email">${esc(s.email)}</span></td><td>${esc(s.rollNo)}</td><td>${esc(s.department)}</td><td>${esc(s.semester)}${s.semester==="1"?"st":s.semester==="2"?"nd":s.semester==="3"?"rd":"th"}</td><td><span class="status-pill ${s.status==="Active"?"status-active":"status-inactive"}">${esc(s.status)}</span></td>${actions?`<td><button class="btn btn-sm btn-outline-primary me-1" data-edit="${esc(s.id)}">Edit</button><button class="btn btn-sm btn-outline-danger" data-delete="${esc(s.id)}">Delete</button></td>`:""}</tr>`}
function fillSelect(id,values,label){const el=$(id);if(!el)return;const old=el.value;el.innerHTML=`<option value="">${label}</option>`+values.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");el.value=values.includes(old)?old:""}
function renderDashboard(){
  const records=readStudents();if($("totalStudents")){$("totalStudents").textContent=records.length;$("activeStudents").textContent=records.filter(s=>s.status==="Active").length;$("departmentTotal").textContent=new Set(records.map(s=>s.department)).size}
  const departments=[...new Set(records.map(s=>s.department))].sort();fillSelect("dashboardDepartment",departments,"All departments");fillSelect("dashboardSemester",[...new Set(records.map(s=>s.semester))].sort((a,b)=>+a-+b),"All semesters");
  if(!$("dashboardStudents"))return;
  const q=$("dashboardSearch").value.toLowerCase(),d=$("dashboardDepartment").value,sem=$("dashboardSemester").value,status=$("dashboardStatus").value;
  const filtered=records.filter(s=>([s.name,s.rollNo,s.email].join(" ").toLowerCase().includes(q))&&(!d||s.department===d)&&(!sem||s.semester===sem)&&(!status||s.status===status)).slice(0,8);
  $("dashboardStudents").innerHTML=filtered.map(s=>studentRow(s)).join("");$("dashboardEmpty").classList.toggle("d-none",filtered.length>0);
}
function renderStudentsPage(){
  const records=readStudents();if(!$("studentsTable"))return;
  $("studentPageTotal").textContent=records.length;$("studentPageActive").textContent=records.filter(s=>s.status==="Active").length;$("studentPageInactive").textContent=records.filter(s=>s.status==="Inactive").length;
  fillSelect("studentDepartment",[...new Set(records.map(s=>s.department))].sort(),"All departments");fillSelect("studentSemester",[...new Set(records.map(s=>s.semester))].sort((a,b)=>+a-+b),"All semesters");
  const q=$("studentSearch").value.toLowerCase(),d=$("studentDepartment").value,sem=$("studentSemester").value,status=$("studentStatus").value,sort=$("studentSort").value;
  let filtered=records.filter(s=>[s.name,s.rollNo,s.email].join(" ").toLowerCase().includes(q)&&(!d||s.department===d)&&(!sem||s.semester===sem)&&(!status||s.status===status));
  if(sort==="name")filtered.sort((a,b)=>a.name.localeCompare(b.name));if(sort==="roll")filtered.sort((a,b)=>a.rollNo.localeCompare(b.rollNo));if(sort==="newest")filtered.sort((a,b)=>Number(b.id)-Number(a.id));
  const pages=Math.max(1,Math.ceil(filtered.length/PAGE_SIZE));studentPage=Math.min(studentPage,pages);const start=(studentPage-1)*PAGE_SIZE,shown=filtered.slice(start,start+PAGE_SIZE);
  $("studentsTable").innerHTML=shown.map(s=>studentRow(s,true)).join("");$("studentsEmpty").classList.toggle("d-none",shown.length>0);
  $("studentResults").textContent=`Showing ${filtered.length?start+1:0}–${Math.min(start+PAGE_SIZE,filtered.length)} of ${filtered.length} students`; $("studentPrev").disabled=studentPage===1;$("studentNext").disabled=studentPage===pages;
}
function renderCourses(){
  const tbody=$("coursesTable");if(!tbody)return;const q=$("courseSearch").value.toLowerCase();
  tbody.innerHTML=sampleCourses.filter(c=>c.join(" ").toLowerCase().includes(q)).map(c=>`<tr><td><strong>${c[0]}</strong></td><td>${c[1]}</td><td>${c[2]}</td><td>${c[3]}</td><td>${c[4]}</td></tr>`).join("");
}
function renderReports(){
  const records=readStudents();if(!$("reportTotal"))return;
  $("reportTotal").textContent=records.length;$("reportActive").textContent=records.filter(s=>s.status==="Active").length;$("reportInactive").textContent=records.filter(s=>s.status==="Inactive").length;$("reportDepartments").textContent=new Set(records.map(s=>s.department)).size;
  const dept={};records.forEach(s=>dept[s.department]=(dept[s.department]||0)+1);
  $("departmentReport").innerHTML=Object.entries(dept).map(([name,count])=>`<tr><td>${esc(name)}</td><td>${count}</td><td>${records.length?Math.round(count/records.length*100):0}%</td></tr>`).join("")||'<tr><td colspan="3" class="text-secondary">No student data available.</td></tr>';
  const sem={};records.forEach(s=>sem[s.semester]=(sem[s.semester]||0)+1);
  $("semesterReport").innerHTML=Object.entries(sem).sort((a,b)=>+a[0]-+b[0]).map(([name,count])=>`<tr><td>Semester ${esc(name)}</td><td>${count}</td></tr>`).join("")||'<tr><td colspan="2" class="text-secondary">No student data available.</td></tr>';
}
function renderAll(){renderDashboard();renderStudentsPage();renderCourses();renderReports()}
function init(){
  buildChrome();buildStudentModal();
  ["dashboardSearch","dashboardDepartment","dashboardSemester","dashboardStatus"].forEach(id=>$(id)?.addEventListener("input",renderDashboard));
  ["studentSearch","studentDepartment","studentSemester","studentStatus","studentSort"].forEach(id=>$(id)?.addEventListener("input",()=>{studentPage=1;renderStudentsPage()}));
  $("studentPrev")?.addEventListener("click",()=>{studentPage--;renderStudentsPage()});$("studentNext")?.addEventListener("click",()=>{studentPage++;renderStudentsPage()});
  $("studentsTable")?.addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit)openEditStudent(edit.dataset.edit);if(del)deleteStudent(del.dataset.delete)});
  $("courseSearch")?.addEventListener("input",renderCourses);
  renderAll();
}
document.addEventListener("DOMContentLoaded",init);
