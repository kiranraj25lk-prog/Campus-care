import bcrypt from 'bcryptjs';
import { db, initDatabase } from './index.js';
import { formatDDMMYYYY } from '../utils/date.js';

export function seed() {
  initDatabase();

  // Clear existing data for clean seed
  db.exec(`
    DELETE FROM notifications;
    DELETE FROM complaints;
    DELETE FROM departments;
    DELETE FROM users;
    DELETE FROM sqlite_sequence WHERE name IN ('notifications', 'departments', 'users');
  `);

  console.log('Seeding departments...');
  const insertDept = db.prepare(`
    INSERT INTO departments (name, description, head_name, contact_email)
    VALUES (?, ?, ?, ?)
  `);

  const depts = [
    {
      name: 'Infrastructure & Maintenance',
      description: 'Campus civil, electrical, plumbing, furniture, and facility maintenance',
      head_name: 'Prof. Ramesh Rao',
      contact_email: 'facilities@campuscare.edu'
    },
    {
      name: 'IT & Network Services',
      description: 'Campus Wi-Fi, computer labs, servers, portal accounts, and AV systems',
      head_name: 'Dr. Sunita Deshmukh',
      contact_email: 'it-support@campuscare.edu'
    },
    {
      name: 'Campus Living & Dining',
      description: 'Hostel accommodation, dining hygiene, mess operations, and transport',
      head_name: 'Mr. Pradeep Joshi',
      contact_email: 'hostel-affairs@campuscare.edu'
    },
    {
      name: 'Academic & Examination Affairs',
      description: 'Class scheduling, lecture halls, faculty coordination, and evaluation records',
      head_name: 'Dr. Meenakshi Sundaram',
      contact_email: 'academic-dean@campuscare.edu'
    }
  ];

  const deptMap = {};
  for (const dept of depts) {
    const res = insertDept.run(dept.name, dept.description, dept.head_name, dept.contact_email);
    deptMap[dept.name] = res.lastInsertRowid;
  }

  console.log('Seeding users...');
  const salt = bcrypt.genSaltSync(10);
  const adminHash = bcrypt.hashSync('Admin@123', salt);
  const studentHash = bcrypt.hashSync('Student@123', salt);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, branch, semester, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const adminRes = insertUser.run(
    'Dr. Arvind Sharma',
    'admin@campuscare.edu',
    adminHash,
    'admin',
    'Administration',
    'N/A',
    formatDDMMYYYY(new Date(2026, 0, 10))
  );
  const adminId = adminRes.lastInsertRowid;

  const students = [
    { name: 'Kiran Kumar', email: 'kiran@student.college.edu', branch: 'Computer Science & Engineering', semester: '6th Semester' },
    { name: 'Rahul S', email: 'rahul@student.college.edu', branch: 'Electronics & Communication', semester: '4th Semester' },
    { name: 'Ananya', email: 'ananya@student.college.edu', branch: 'Information Science & Engineering', semester: '6th Semester' },
    { name: 'Suman', email: 'suman@student.college.edu', branch: 'Mechanical Engineering', semester: '8th Semester' },
    { name: 'Vivek', email: 'vivek@student.college.edu', branch: 'Civil Engineering', semester: '4th Semester' },
    { name: 'Priya', email: 'priya@student.college.edu', branch: 'Electrical & Electronics', semester: '2nd Semester' }
  ];

  const studentMap = {};
  for (const s of students) {
    const res = insertUser.run(
      s.name,
      s.email,
      studentHash,
      'student',
      s.branch,
      s.semester,
      formatDDMMYYYY(new Date(2026, 0, 15))
    );
    studentMap[s.name] = res.lastInsertRowid;
  }

  console.log('Seeding complaints...');
  const insertComplaint = db.prepare(`
    INSERT INTO complaints (
      id, user_id, title, category, description, image_path, priority, status, department_id, admin_remarks, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleComplaints = [
    {
      id: 'C1001',
      student: 'Kiran Kumar',
      title: 'Classroom 402 LCD Projector Lamp Flickering',
      category: 'Classroom',
      description: 'The overhead Epson projector in LH-402 flickers repeatedly every 2 minutes, making slides unreadable during CS301 lectures.',
      image: null,
      priority: 'Medium',
      status: 'Resolved',
      department: 'IT & Network Services',
      remarks: 'Replaced faulty HDMI transmitter and projector lamp. Verified working with faculty.',
      date: '02-09-2026'
    },
    {
      id: 'C1002',
      student: 'Kiran Kumar',
      title: 'Hostel Block B 3rd Floor Wi-Fi Signal Loss',
      category: 'Wi-Fi/Network',
      description: 'No internet access points detectable along rooms 301 to 318 in Hostel Block B since Sunday evening.',
      image: null,
      priority: 'High',
      status: 'In Progress',
      department: 'IT & Network Services',
      remarks: 'Access point AP-B3 underwent reboot; network team currently diagnosing fiber uplink router switch.',
      date: '08-10-2026'
    },
    {
      id: 'C1003',
      student: 'Rahul S',
      title: 'Main Canteen Water Purifier Leakage',
      category: 'Plumbing',
      description: 'The RO water dispenser near the east counter is continuously dripping water, creating a slippery hazard on the dining floor.',
      image: null,
      priority: 'Medium',
      status: 'Resolved',
      department: 'Infrastructure & Maintenance',
      remarks: 'Replaced silicone seal and filter cartridge. Leak completely fixed.',
      date: '14-09-2026'
    },
    {
      id: 'C1004',
      student: 'Ananya',
      title: 'Lab 3 Air Conditioning Unit Failure',
      category: 'Electrical',
      description: 'Two split AC units in Lab 3 are not blowing cold air. System overheating warnings were triggered on database servers.',
      image: null,
      priority: 'High',
      status: 'In Progress',
      department: 'Infrastructure & Maintenance',
      remarks: 'Technician called for compressor gas refilling. Expected resolution within 24 hours.',
      date: '09-10-2026'
    },
    {
      id: 'C1005',
      student: 'Suman',
      title: 'Hostel Mess Food Hygiene and Food Quality',
      category: 'Canteen',
      description: 'Drinking glasses were unwashed and several food items were served cold at dinner. Requested strict quality monitoring.',
      image: null,
      priority: 'High',
      status: 'Resolved',
      department: 'Campus Living & Dining',
      remarks: 'Inspected canteen vendor with student committee. Issued compliance notice and sanitation audit.',
      date: '20-09-2026'
    },
    {
      id: 'C1006',
      student: 'Vivek',
      title: 'Seminar Hall Sound System Microphone Humming',
      category: 'Classroom',
      description: 'Loud ground loop hum whenever wireless microphone 2 is used during technical seminars.',
      image: null,
      priority: 'Low',
      status: 'Resolved',
      department: 'IT & Network Services',
      remarks: 'Grounded the audio mixer line and replaced defective XLR cable.',
      date: '24-09-2026'
    },
    {
      id: 'C1007',
      student: 'Priya',
      title: 'Library 2nd Floor Emergency Exit Door Jammed',
      category: 'Classroom',
      description: 'Emergency fire exit push bar on the 2nd floor stack area is stuck and will not push open smoothly.',
      image: null,
      priority: 'High',
      status: 'In Progress',
      department: 'Infrastructure & Maintenance',
      remarks: 'Carpentry and safety inspection team assigned. Push bar latch mechanism is being replaced.',
      date: '10-10-2026'
    },
    {
      id: 'C1008',
      student: 'Kiran Kumar',
      title: 'Delayed Internal Assessment Marks Upload on Portal',
      category: 'Academic/Faculty',
      description: 'Marks for elective CS504 have not been reflected on the ERP portal after deadline, preventing grade checks.',
      image: null,
      priority: 'Medium',
      status: 'Pending',
      department: 'Academic & Examination Affairs',
      remarks: null,
      date: '11-10-2026'
    },
    {
      id: 'C1009',
      student: 'Rahul S',
      title: 'Hostel Block A Solar Water Heater Not Heating',
      category: 'Electrical',
      description: 'Hot water supply in bathrooms 101 to 110 has been cold for the last 3 days due to faulty heating element.',
      image: null,
      priority: 'Medium',
      status: 'Pending',
      department: 'Infrastructure & Maintenance',
      remarks: null,
      date: '11-10-2026'
    },
    {
      id: 'C1010',
      student: 'Ananya',
      title: 'Broken Desk Benches in Room 204',
      category: 'Classroom',
      description: 'Three student benches in row 4 have cracked wooden support frames that wobble dangerous during lectures.',
      image: null,
      priority: 'Low',
      status: 'Resolved',
      department: 'Infrastructure & Maintenance',
      remarks: 'Replaced 4 broken desks with new modular ergonomic benches.',
      date: '18-09-2026'
    },
    {
      id: 'C1011',
      student: 'Suman',
      title: 'Campus North Gate Streetlight Not Functioning',
      category: 'Electrical',
      description: 'Pathway between North Gate and Mechanical Workshop is completely dark after 7 PM.',
      image: null,
      priority: 'High',
      status: 'Resolved',
      department: 'Infrastructure & Maintenance',
      remarks: 'Installed new 100W LED street lamp and renewed underground wiring.',
      date: '28-09-2026'
    },
    {
      id: 'C1012',
      student: 'Kiran Kumar',
      title: 'Computer Lab 2 Systems Cannot Access College Cloud',
      category: 'Wi-Fi/Network',
      description: 'Desktops 15 through 30 in Lab 2 receive network connection timeout when connecting to git repository server.',
      image: null,
      priority: 'High',
      status: 'In Progress',
      department: 'IT & Network Services',
      remarks: 'DNS gateway updated on subnet 192.168.10.x. Final connectivity tests under way.',
      date: '07-10-2026'
    },
    {
      id: 'C1013',
      student: 'Vivek',
      title: 'Restroom Flush Valve Leakage in Mechanical Block',
      category: 'Plumbing',
      description: 'Continuous water running through flush tanks in ground floor washroom, leading to water wastage.',
      image: null,
      priority: 'Medium',
      status: 'Pending',
      department: 'Infrastructure & Maintenance',
      remarks: null,
      date: '12-10-2026'
    },
    {
      id: 'C1014',
      student: 'Priya',
      title: 'Late Evening Campus Shuttle Timings Schedule Missing',
      category: 'Other',
      description: 'Students staying back for sports and lab work lack updated timetable for evening transit buses.',
      image: null,
      priority: 'Low',
      status: 'Resolved',
      department: 'Campus Living & Dining',
      remarks: 'Printed schedule posted at north and south bus stops and uploaded to portal noticeboard.',
      date: '03-10-2026'
    },
    {
      id: 'C1015',
      student: 'Rahul S',
      title: 'Hostel Reading Room Poor Lighting',
      category: 'Electrical',
      description: 'Insufficient ambient light in the basement reading hall for night study sessions.',
      image: null,
      priority: 'Medium',
      status: 'Resolved',
      department: 'Infrastructure & Maintenance',
      remarks: 'Added 6 LED tube lights to reading room study bays.',
      date: '25-09-2026'
    },
    {
      id: 'C1016',
      student: 'Ananya',
      title: 'Course Registration Portal Gateway Timeout',
      category: 'Academic/Faculty',
      description: 'Registration server crashed when 3rd year students tried submitting open elective choices.',
      image: null,
      priority: 'High',
      status: 'Resolved',
      department: 'IT & Network Services',
      remarks: 'Increased server thread pool and optimized SQL database indexes for concurrent registration.',
      date: '16-09-2026'
    },
    {
      id: 'C1017',
      student: 'Vivek',
      title: 'Water Cooler in Civil Engineering Block Inactive',
      category: 'Plumbing',
      description: 'Water dispenser on the 1st floor does not cool water and tap handle is loose.',
      image: null,
      priority: 'Medium',
      status: 'In Progress',
      department: 'Infrastructure & Maintenance',
      remarks: 'Compressor motor sent for rewinding. Interim canned dispenser provided.',
      date: '09-10-2026'
    },
    {
      id: 'C1018',
      student: 'Suman',
      title: 'Hostel Badminton Court Floodlight Tripping MCB',
      category: 'Electrical',
      description: 'Switching on the court lights trips circuit breaker in Hostel B distribution board.',
      image: null,
      priority: 'Low',
      status: 'Pending',
      department: 'Infrastructure & Maintenance',
      remarks: null,
      date: '12-10-2026'
    },
    {
      id: 'C1019',
      student: 'Kiran Kumar',
      title: 'Canteen Juice Counter Overcharging Students',
      category: 'Canteen',
      description: 'Juice stall vendor charging Rs. 10 above the college approved price list for fresh fruit items.',
      image: null,
      priority: 'Medium',
      status: 'Resolved',
      department: 'Campus Living & Dining',
      remarks: 'Contractor penalised and official college price rate chart prominently displayed.',
      date: '22-09-2026'
    },
    {
      id: 'C1020',
      student: 'Priya',
      title: 'Girls Hostel Block C Geyser Thermostat Defective',
      category: 'Electrical',
      description: 'Water temperature exceeding boiling point without automatic cutoff, safety concern.',
      image: null,
      priority: 'High',
      status: 'In Progress',
      department: 'Infrastructure & Maintenance',
      remarks: 'Electrician dispatched with replacement ceramic thermostat unit.',
      date: '10-10-2026'
    },
    {
      id: 'C1021',
      student: 'Rahul S',
      title: 'Auditorium Acoustic Dampers Loose on Wall',
      category: 'Classroom',
      description: 'Two acoustic fabric panels on side wall of Main Auditorium are hanging loosely.',
      image: null,
      priority: 'Low',
      status: 'Pending',
      department: 'Infrastructure & Maintenance',
      remarks: null,
      date: '12-10-2026'
    },
    {
      id: 'C1022',
      student: 'Suman',
      title: 'Mechanical Workshop Air Compressor Pressure Gauge Broken',
      category: 'Other',
      description: 'Needle on pneumatic compressor gauge is snapped off, cannot inspect safe working PSI.',
      image: null,
      priority: 'High',
      status: 'Pending',
      department: 'Infrastructure & Maintenance',
      remarks: null,
      date: '12-10-2026'
    }
  ];

  for (const c of sampleComplaints) {
    const studentId = studentMap[c.student] || studentMap['Kiran Kumar'];
    const deptId = c.department ? deptMap[c.department] : null;
    insertComplaint.run(
      c.id,
      studentId,
      c.title,
      c.category,
      c.description,
      c.image,
      c.priority,
      c.status,
      deptId,
      c.remarks,
      c.date,
      c.date
    );
  }

  console.log('Seeding notifications...');
  const insertNotification = db.prepare(`
    INSERT INTO notifications (user_id, message, is_read, created_at)
    VALUES (?, ?, ?, ?)
  `);

  const kiranId = studentMap['Kiran Kumar'];
  insertNotification.run(kiranId, 'Complaint C1001 marked as Resolved by Administration.', 1, '03-09-2026');
  insertNotification.run(kiranId, 'Complaint C1002 assigned to IT & Network Services. Technician investigating.', 0, '08-10-2026');
  insertNotification.run(kiranId, 'Complaint C1012 updated to In Progress: DNS gateway updated on subnet.', 0, '09-10-2026');
  insertNotification.run(kiranId, 'Complaint C1019 marked as Resolved: Vendor rate list corrected.', 1, '23-09-2026');

  // Admin notifications
  insertNotification.run(adminId, 'New high-priority complaint C1022 logged by Suman in Workshop.', 0, '12-10-2026');
  insertNotification.run(adminId, 'Complaint C1020 assigned to Infrastructure & Maintenance.', 0, '10-10-2026');
  insertNotification.run(adminId, 'Weekly grievance redressal report ready for download.', 1, '11-10-2026');

  console.log('Seeding completed successfully!');
}

if (process.argv[1]?.endsWith('seed.js')) {
  seed();
}
