class Student {
  constructor(id, name, courses) {
    this.id = id;
    this.name = name;
    this.courses = courses;
  }
}

class Course {
  constructor(id, name, prereqIDs) {
    this.id = id;
    this.name = name;
    this.prereqIDs = prereqIDs;
  }

  canEnroll(student) {
    for (const prereqId of this.prereqIDs) {
      if (!student.courses.includes(prereqId)) {
        return false;
      }
    }
    return true;
  }
}

const courses = [
  new Course(0, 'Intro to Programming', [-1]),
  new Course(1, 'Data Structures', [0]),
  new Course(2, 'Algorithms', [1]),
  new Course(3, 'Database Management', [0]),
  new Course(4, 'Web Development', [0]),
  new Course(5, 'Operating Systems', [1, 2]),
  new Course(6, 'Computer Networks', [1, 5]),
  new Course(7, 'Software Engineering', [1, 2]),
  new Course(8, 'Machine Learning', [1, 2]),
  new Course(9, 'Distributed Systems', [5]),
  new Course(10, 'Cybersecurity', [2, 3]),
  new Course(11, 'Cloud Computing', [2, 3]),
  new Course(12, 'Mobile App Development', [4]),
  new Course(13, 'Game Development', [0]),
  new Course(14, 'Artificial Intelligence', [2, 8]),
  new Course(15, 'Big Data Analytics', [2, 3]),
  new Course(16, 'Blockchain Technology', [2, 3]),
  new Course(17, 'UI/UX Design', [14]),
  new Course(18, 'Embedded Systems', [1, 5]),
  new Course(19, 'Computer Graphics', [0])
];

const student = new Student(1, 'John Doe', [0, 1, 2, 3, 4]);

const targetCourses = [
  courses[13], //Game Development
  courses[16], //Blockchain Technology
  courses[17], //UI/UX Design (student cannot enroll)
  courses[18]  //Embedded Systems
];

console.log(`Enrollment status for ${student.name}:`);
for (const course of targetCourses) {
  if (course.canEnroll(student)) {
    console.log(`- Can enroll in ${course.name}`);
  } else {
    console.log(`- Cannot enroll in ${course.name} due to missing prerequisites.`);
  }
}
