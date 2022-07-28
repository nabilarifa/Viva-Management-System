
1) Post(http://localhost:port/logIn) :
    {
        email: email,
        password: password,
    }
2) Post(http://localhost:port/signUp) :
    {
        firstName: First Name,
        lastName: Last Name,
        email: email,
        password: password,
        teacherMode: true,
        teacherPass: tpass
    }


3) Get(http://localhost:port/currentExam):
    {
        upcomingExam: upcomingExam,  // [array]
        runningExam: runningExam,    // [array]
        inishedExam: finishedExam,   // [array]
    }

4) Post(http://localhost:port/getDetails)
    {
        details: [{roll: 2017331063, time: '02: 10PM' } , {roll: 2017331064, time: '02: 20PM' } , {roll: 2017331070, time: '02: 30PM'}  ]
    }

5) Get(http://localhost:port/profileData):
    {
        firstName: First Name,
        lastName: Last Name,
        designation: Lecturer,
        about: shobai khaishta...        
    }