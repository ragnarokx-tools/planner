import React, { useState, useEffect } from 'react';
import './App.css';
import jobData from './resources/jobs.json'
import skillData from './resources/skills.json'
import Job from './job/Job.js';
import skillSprites from './icons/all_skills_global.png'
import { Buffer } from 'buffer';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import ReactGA from "react-ga4";


function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentHash = location.pathname;
  const [jobId, setJob] = useState(1);
  const [skillLevels, setSkills] = useState({});
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    try {
      setTimeout(_ => {
        ReactGA.initialize("G-10CRLLHRXZ");
        ReactGA.send({ hitType: "pageview", page: currentHash });
      }, 4000)
      } catch(err) {
      console.log(err)
    }
  }, [])

  useEffect(() => {
    // Just unga bunga fix this condition on load
    if (window.location.pathname === '/planner' || window.location.pathname === '/planner#') {
      window.location.pathname = '/planner/'
    } else if (currentHash) {
      ReactGA.event({
        category: "Builds",
        action: "Load Path",
        label: currentHash
      });
      const isShaPath = matchPath("/:encoded", currentHash)
      if (isShaPath) {
        try {
          const sha = isShaPath.params.encoded
          const unpackedString = Buffer.from(sha, 'base64').toString('ascii');
          const parsed = JSON.parse(unpackedString)
          if (parsed) {
            setJob(parsed.jobId)
            setSkills(parsed.skillLevels)
            if (!copySuccess) {
              setCopySuccess('Imported!');
              setTimeout(() => {
                setCopySuccess('');
              }, 2000); // Reset message after 2 seconds
            }
            ReactGA.event({
              category: "Builds",
              action: "Load",
              label: "Success", // optional
              value: parsed.jobId // optional, must be a number
            });
          }
        } catch {
          console.log("redirecting due to unparsed build")
          // just give up
          navigate('/', { replace: true })
          ReactGA.event({
            category: "Builds",
            action: "Load",
            label: "Failure"
          });
        }
      }
    }
  }, [currentHash, location, navigate])
  // Only depend on the path changing. Everything else is fine.

  const handlePackData = async () => {
    ReactGA.event({
      category: "Builds",
      action: "Save",
      label: "Attempted"
    });
    const skillLevelsClean =  Object.fromEntries(
      Object.entries(skillLevels).filter(([key, value]) => value !== 0)
    )
    const packed = JSON.stringify({
      "jobId": jobId,
      "skillLevels": skillLevelsClean
    })

    const base64String = Buffer.from(packed).toString('base64');

    if (base64String) {
      // navigate first
      navigate(`/${base64String}`, { replace: true });
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess('URL Copied!');
        setTimeout(() => {
          setCopySuccess('');
        }, 2000); // Reset message after 2 seconds
        ReactGA.event({
          category: "Builds",
          action: "Save",
          label: "Success",
          value: jobId
        });
      } catch (err) {
        setCopySuccess('Failed to copy URL');
      }
    }
  }

  const jobList = jobData.jobs

  const onChangeJobHandler = (event) => {
    const jobId = parseInt(event.target.value);
    if (Object.keys(skillLevels).length !== 0) {
        if (window.confirm("Changing job will reset all skills. Continue?")) {
          setSkills({})
          setJob(jobId)
          navigate('/', { replace: true });
          window.scrollTo({ top: 0, left: 0})
        }
      } else {
        setSkills({})
        setJob(jobId)
        navigate('/', { replace: true });
        window.scrollTo({ top: 0, left: 0})
      }
  }
  
  const handleResetSkills = () => {
    if (window.confirm("Are you sure you want to reset all skills?")) {
      // Proceed with submission
      setSkills({})
      navigate('/', { replace: true });
    } else {
    }  
  }

  // join the job skillTree with the skill data
  const getJobDataById = () => {
    const jobObject = jobList.find(job => job.id === jobId)
    const skillTree = jobObject.skillTree
    if (skillTree) {
      const skills = skillData.filter((skill) => skillTree.some((skillId) => skillId === skill.id))
      return {...jobObject, "skills": skills}
    } else {
      return jobObject
    }
  }

  if (!jobData) {
    return <div>Loading static data... Try reloading if it doesn't work.</div>
  }
  
  const renderSaveButton = () => {
    return <button onClick={handlePackData}>save</button>
  }

  const renderResetButton = () => {
    return <button onClick={handleResetSkills}>reset</button>
  }

  /* 
    Renders a display of total skill points
  */
  const renderTotalSkillPointsUsed = () => {
    let sum = 0;
    if(skillLevels) {
      Object.values(skillLevels).map((level) => 
        sum += level
      )
    }
    let advisory;
    if (sum > 170) {
      advisory = <div className="App-jobWarning">warning: exceeds possible job levels</div>
    }
    return <div className="App-totalJobPoints">{sum}/170{advisory}</div>
  }

  const jobSelector = () => {
    return (
    <select name="job" value={jobId} onChange={onChangeJobHandler}>
      {jobList.map((job) => <option key={job.id} value={job.id}>{job.name}</option>)}
    </select>
    )
  }

  const header = () => {
    return (
      <div className="App-header">
        <div className="App-jobName">{jobSelector()}</div>
        {renderTotalSkillPointsUsed()}
        <div className="App-jobButtons">
          {renderSaveButton()}{renderResetButton()}
        </div>
        {copySuccess ? 
          <div className="App-copiedUrl" style={{height: "24px"}}>{copySuccess}</div> :
          <div className="App-copiedUrl" style={{height: "0px"}}></div>
        }
       
      </div>
    )
  }

  return (
    <div className="App">
      {header()}
      <div className="App-jobContent">
      { jobId ?  
        <Job 
          data={getJobDataById()}
          skillLevels={skillLevels}
          setSkills={setSkills}
          spriteSheet={skillSprites}
        /> : null }
      </div>
    </div>
  );
}

export default App;
