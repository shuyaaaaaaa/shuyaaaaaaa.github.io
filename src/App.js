import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Scrollspy from 'react-scrollspy';

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [text, setText] = useState("I am a ");
    const [isTyping, setIsTyping] = useState(true);
    const defaultText = "I am a ";
    const words = ["Front-end Developer.", "Back-end Developer.", "Full-stack Developer.", "UI/UX Designer."];
    const currentWordIndex = useRef(0);  
    const currentIndex = useRef(defaultText.length);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activePage, setActivePage] = useState("home");
    const [mySkillsActive, setMySkillsActive] = useState(false);
    const [HomeActive, setHomeActive] = useState(false);
    const [MyProjectsActive, setMyProjectsActive] = useState(false);
    const [AboutMeActive, setAboutMeActive] = useState(false);
    const [ContactMeActive, setContactMeActive] = useState(false);
    const [skillValues, setSkillValues] = useState({
      "HTML/CSS": 0,
      "MachineLearning": 0,
      "Python": 0,
      "Java": 0,
      "SQL": 0,
    });
    const skillMaxValues = {
      "HTML/CSS": 70,  
      "MachineLearning": 65,
      "Python": 70,
      "Java": 60,
      "SQL": 65,
    };
    

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        function typeText() {
            if (isTyping) {
                const currentWord = words[currentWordIndex.current];  
                if (currentIndex.current <= defaultText.length + currentWord.length) {
                    setText(defaultText + currentWord.slice(0, currentIndex.current - defaultText.length));
                    currentIndex.current++;  
                    setTimeout(typeText, 200);
                } else {
                    setTimeout(() => {
                        setIsTyping(false);
                    }, 1000);
                }
            }
        }

        function deleteText() {
            if (!isTyping) {
                const currentWord = words[currentWordIndex.current];  
                if (currentIndex.current > defaultText.length) {
                    setText(defaultText + currentWord.slice(0, currentIndex.current - defaultText.length - 1));
                    currentIndex.current--; 
                    setTimeout(deleteText, 50);
                } else {
                    setIsTyping(true);
                    currentWordIndex.current = (currentWordIndex.current + 1) % words.length; 
                }
            }
        }
        
        if (isTyping) {
            typeText();
        } else {
            deleteText();
        }
    }, [isTyping]);

    const [currdeg, setCurrdeg] = useState(0);

    function rotateCarousel() {
        setCurrdeg(currdeg - 120);
    }   

    useEffect(() => {
      if (mySkillsActive) {
        const interval = setInterval(() => {
          setSkillValues(prevValues => {
            let newValues = { ...prevValues };
            let allSkillsMaxed = true;
            for (let skill in prevValues) {
              if (prevValues[skill] < skillMaxValues[skill]) {
                newValues[skill] = prevValues[skill] + 1;
                allSkillsMaxed = false;
              }
            }
            if (allSkillsMaxed) {
              clearInterval(interval);
            }
            return newValues;
          });
        }, 20);  
        
        return () => clearInterval(interval); 
      }
    }, [mySkillsActive]);

    const [currentProjectAImage, setCurrentProjectAImage] = useState(0);
    const [currentProjectBImage, setCurrentProjectBImage] = useState(0);
    const [currentProjectCImage, setCurrentProjectCImage] = useState(0);

    const projectAImages = [
      "Asteroid1.png",
      "Asteroid2.png",
      "Asteroid3.png"                                              
    ]

    const projectBImages = [
      "DublinBike1.png",
      "DublinBike2.png",
      "DublinBike3.png"                                              
    ]

    const projectCImages = [
      "InPeace1.png",
      "InPeace2.png",
      "InPeace3.png",
      "InPeace4.png",
      "InPeace5.png"                                        
    ]

    useEffect(() => {
      const changeImages = setInterval(() => {
        setCurrentProjectAImage((prevImage) => (prevImage + 1) % projectAImages.length);
        setCurrentProjectBImage((prevImage) => (prevImage + 1) % projectBImages.length);
        setCurrentProjectCImage((prevImage) => (prevImage + 1) % projectCImages.length);
      }, 10000);

      return () => clearInterval(changeImages);
    },[projectAImages.length, projectBImages.length, projectCImages.length])
    
    
    useEffect(() => {
      const targets = document.querySelectorAll('.projectName, .projectTechnologies p');
  
      if (MyProjectsActive) {
          targets.forEach(target => target.classList.add('active'));
      } else {
          targets.forEach(target => target.classList.remove('active'));
      }
    }, [MyProjectsActive]);

    const backendURL = process.env.REACT_APP_BACKEND_URL;


function handleFormSubmit(e) {
    console.log('Form submit handler called');
    e.preventDefault();

    const formData = new URLSearchParams(new FormData(e.target));

    fetch(`${backendURL}/send-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        alert('Email sent successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send email.');
    });
}

    return (
        <div className="app">
            {isLoading ? (
                <div className="loading-spinner">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className='main'>
                    <div className={`header ${activePage}`}>
                        <div className={`logo ${activePage}`} onClick={() => document.getElementById("first").scrollIntoView({ behavior: "smooth" })}>
                            <p>SHUYA</p>
                        </div>
                        <div className={`sideBarIcon ${activePage}`}>
                            <i className="fa-solid fa-bars" onClick={() => setIsSidebarOpen(true)}></i>
                        </div>  
                    </div>

                    <div className={`sideBar ${isSidebarOpen ? "open" : ""} ${activePage === "others" ? "others" : ""}`}>
                        <div className='closeIcon'>
                            <i className="fa-solid fa-xmark" onClick={() => setIsSidebarOpen(false)}></i>
                        </div>
                        <div className='sideBarList'>
                        <Scrollspy 
                            items={['first', 'second', 'third', 'fourth', 'fifth']} 
                            currentClassName={`is-current ${activePage}`}
                            offset={-200}
                            onUpdate={(item) => {
                                if (item && item.id) {
                                    setActivePage(item.id === "first" || item.id === "third" || item.id === "fifth" ? "home" : "others");
                                    setMySkillsActive(item.id === "fourth");
                                    setMyProjectsActive(item.id === "third");
                                    setAboutMeActive(item.id === "second");
                                    setHomeActive(item.id === "first");
                                    setContactMeActive(item.id === "fifth");
                                }
                            }}>
                            <p onClick={() => document.getElementById("first").scrollIntoView({ behavior: "smooth" })}>HOME</p>
                            <p onClick={() => document.getElementById("second").scrollIntoView({ behavior: "smooth" })}>ABOUT ME</p>
                            <p onClick={() => document.getElementById("third").scrollIntoView({ behavior: "smooth" })}>PROJECTS</p>
                            <p onClick={() => document.getElementById("fourth").scrollIntoView({ behavior: "smooth" })}>PORTFOLIO</p>
                            <p onClick={() => document.getElementById("fifth").scrollIntoView({ behavior: "smooth" })}>CONTACT</p>
                        </Scrollspy>
                        </div>
                        <div className='email'>
                            <p>shuyaikeo@gmail.com</p>
                        </div>
                    </div>

                    <div id="first" className='first'>
                        <div className='introduction'>
                            <p>Hello,</p>
                            <p>I'm Shuya Ikeo</p>
                            <p>I am a <span className= "typing">{text.replace(defaultText, "")}</span></p>
                            <p className='contactMe' onClick={() => document.getElementById("fifth").scrollIntoView({ behavior: "smooth" })}>Contact me <i class="fa-solid fa-arrow-right"></i></p>
                        </div> 
                        <div className='firstImage'>
                          <img src="avatar6.png" alt="Avatar Image1"></img>
                        </div>
                    </div>
                    <div id="second" className='second'>
                      <div className='aboutMePic'>
                        <img src="avatar5.png" alt="Avatar Image2"></img>
                      </div>
                      <div className='aboutMeRight'>
                      <div className='aboutMeTexts'>
                      <h1>Shuya Ikeo</h1>
                      <p>MSc Computer Science, BSc Applied Chemistry</p>
                      <h2>Computer Science graduate student with a foundation in Applied Chemistry, actively exploring developer roles and eager to contribute to any challenge ahead.</h2>

                      </div>
                      <div className='links'>
                        <i class="fa-brands fa-github" 
                        onClick={() => window.open("https://github.com/shuyaaaaaaa", "_blank")}
                        style={{cursor: "pointer"}}></i>
                        <i class="fa-brands fa-linkedin"
                        onClick={() => window.open("https://www.linkedin.com/in/shuya-ikeo-072990291/", "_blank")}
                        style={{cursor: "pointer"}}></i>
                        <i class="fa-solid fa-file"
                        onClick={() => window.open("https://github.com/shuyaaaaaaa/My-CV/blob/main/Shuya%20Ikeo_%20CV.pdf", "_blank")}
                        style={{cursor: "pointer"}}></i>
                      </div>  
                      </div>
                    </div>
                    
                    <div id="third" className='third'>
                      <div className='projectText'>
                        <h1>My Projects</h1>
                        <p>I have designed and developped applications through my college career.</p>
                      </div>
                      <div className='projectContainer'>
                        <div className='projects' style={{ transform: `rotateY(${currdeg}deg)` }}>
                        <div className='project a' onClick={rotateCarousel}>
                          <div className='projectImageContainer'><div className='projectImage a' style={{backgroundImage:`url(${projectAImages[currentProjectAImage]})`}}></div></div>
                          <div className='projectDetail a'
                          onClick={() => window.open("https://github.com/shuyaaaaaaa/Asteroid-game.git", "_blank")}
                          style={{cursor: "pointer"}}>
                            <div className='projectName'>
                              <h1>Asteroid Game</h1>
                            </div>
                            <div className='projectTechnologies a'>
                              <p>Java</p>
                            </div>  
                            <div className='projectExplanation a'>
                              <span>Click here for details <i class="fa-solid fa-arrow-right"></i></span>
                            </div>
                          </div>
                        </div>
                        <div className='project b' onClick={rotateCarousel}>
                        <div className='projectImageContainer'><div className='projectImage b' style={{backgroundImage:`url(${projectBImages[currentProjectBImage]})`}}></div></div>
                          <div className='projectDetail b' 
                          onClick={() => window.open("https://github.com/shuyaaaaaaa/Dublin-Bike.git", "_blank")}
                          style={{cursor: "pointer"}}>
                            <div className='projectName'>
                              <h1>Dublin Bike application</h1>
                            </div>
                            <div className='projectTechnologies b'>
                              <p>Python (Flask)</p>
                              <p>HTML/CSS/JavaScript</p>
                              <p>Machine Learning</p>
                              <p>API</p>
                            </div>  
                            <div className='projectExplanation b'>
                              <span>Click here for details <i class="fa-solid fa-arrow-right"></i></span>
                            </div>
                          </div>
                        </div>
                        <div className='project c' onClick={rotateCarousel}>
                          <div className='projectImageContainer'><div className='projectImage c' style={{backgroundImage:`url(${projectCImages[currentProjectCImage]})`}}></div></div>
                          
                              <div className='projectDetail c' 
                                    onClick={() => window.open("https://github.com/shuyaaaaaaa/In-Peace.git", "_blank")}
                                    style={{cursor: "pointer"}}>
                                  <div className='projectName'>
                                      <h1>InPeace</h1>
                                  </div>
                                  <div className='projectTechnologies c'>
                                      <p>Docker</p>
                                      <p>React</p>
                                      <p>Machine Learning</p>
                                      <p>Flask</p>
                                      <p>PostGres</p>
                                  </div>  
                                  <div className='projectExplanation c'>
                                    <span>Click here for details <i class="fa-solid fa-arrow-right"></i></span>
                                  </div>
                              </div>
                         
                        </div>

                        </div>   
                      </div>
                    </div>

                    <div id="fourth" className='fourth'>
                      <div className='education'>
                        <div className='educationTitle'>
                          <h1>Education</h1>
                        </div>
                        <div className='educationBox'>
                          <div className='ucd'>
                            <p>2022 ~ 2023</p>
                            <p>MSc Computer Science</p>
                            <p>University College Dublin (Dublin/Ireland)</p>
                          </div>
                          <div className='meiji'>
                            <p>2017 ~ 2022</p>
                            <p>BSc Applied Chemistry</p>
                            <p>Meiji University (Tokyo/Japan)</p>
                          </div>
                        </div>
                      </div>
                      <div className='experience'>
                        <div className='experienceTitle'>
                          <h1>Experience</h1>
                        </div>
                        <div className='experienceBox'>
                          <div className='intern'>
                            <p>2023 ~ Present</p>
                            <p>Software Engineering Intern</p>
                            <p>Vyra (Dublin/Ireland)</p>
                          </div>
                          <div className='football'>
                            <p>2020 ~ 2021</p>
                            <p>Football Team Captain</p>
                            <p>Meiji University (Tokyo/Japan)</p>
                          </div>
                        </div>
                      </div>
                      <div className='mySkills'>
                        <div className='mySkillsTitle'>
                          <h1>My skills</h1>
                        </div>  
                        <div className='mySkillsBox'>
                          <div className='htmlcss'>
                          <div className="skill-name">HTML/CSS</div>
                            <div className="skill-bar-container">
                              <div className="skill-bar" style={{ width: `${skillValues["HTML/CSS"]}%` }}></div>
                              <div className="skill-value" style={{ left: `${skillValues["HTML/CSS"] + 5}%`,transform: `translateX(-${skillValues["HTML/CSS"] / 2}%)` }}>{skillValues["HTML/CSS"]}%</div>
                            </div>
                          </div>
                          <div className='MachineLearning'>
                            <div className="skill-name">MachineLearning</div>
                            <div className="skill-bar-container">
                              <div className="skill-bar" style={{ width: `${skillValues["MachineLearning"]}%` }}></div>
                              <div className="skill-value" style={{ left: `${skillValues["MachineLearning"] + 5}%`,transform: `translateX(-${skillValues["MachineLearning"] / 2}%)` }}>{skillValues["MachineLearning"]}%</div>
                            </div>
                          </div>
                          <div className='Python'>
                            <div className="skill-name">Python</div>
                            <div className="skill-bar-container">
                              <div className="skill-bar" style={{ width: `${skillValues["Python"]}%` }}></div>
                              <div className="skill-value" style={{ left: `${skillValues["Python"] + 5}%`,transform: `translateX(-${skillValues["Python"] / 2}%)` }}>{skillValues["Python"]}%</div>
                            </div>
                          </div>
                          <div className='Java'>
                            <div className="skill-name">Java</div>
                            <div className="skill-bar-container">
                              <div className="skill-bar" style={{ width: `${skillValues["Java"]}%` }}></div>
                              <div className="skill-value" style={{ left: `${skillValues["Java"] + 5}%`,transform: `translateX(-${skillValues["Java"] / 2}%)` }}>{skillValues["Java"]}%</div>
                            </div>
                          </div>
                          <div className='SQL'>
                            <div className="skill-name">SQL</div>
                            <div className="skill-bar-container">
                              <div className="skill-bar" style={{ width: `${skillValues["SQL"]}%` }}></div>
                              <div className="skill-value" style={{ left: `${skillValues["SQL"] + 5}%`,transform: `translateX(-${skillValues["SQL"] / 2}%)` }}>{skillValues["SQL"]}%</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div id="fifth" className="fifth">
                      <div className='contactMeContainer'>
                      <div className="contact-section">
                          <h2>Contact me</h2>
                          <form id="contactForm" enctype="application/x-www-form-urlencoded" onSubmit={handleFormSubmit}>
                              <input type="text" name="name" placeholder="Name" />
                              <input type="email" name="email" placeholder="Email" />
                              <input type="text" name="subject" placeholder="Subject" />
                              <textarea name="comment" placeholder="Comment"></textarea>
                              <button type="submit">Send Message</button>
                          </form>

                      </div>
                      <div className="info-section">
                          <h2>Get in touch</h2>
                          <p>Always available for getting in touch, 24/7. Feel free to contact me.</p>
                          <p>
                          <i class="fa-solid fa-location-dot"></i> Dublin/Ireland, Tokyo/Japan
                          </p>
                          <p>
                          <i class="fa-solid fa-envelope"></i> shuyaikeo@gmail.com
                          </p>
                          <p>
                          <i class="fa-solid fa-phone"></i> +353 083 098 8657
                          </p>
                      </div>
                      </div>
                  </div>


                </div>
            )}
        </div>
    );
}

export default App;
