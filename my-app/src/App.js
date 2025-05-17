import { useState, useEffect } from 'react';
import './App.css';
import jobData from './resources/jobs.json'
import skillData from './resources/skills.json'
import Job from './job/Job.js';
import skillSprites from './icons/all_skills_global.png'
import { Buffer } from 'buffer';
import { useLocation, matchPath, useNavigate } from 'react-router-dom';

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [jobId, setJob] = useState(1);
  const [skillLevels, setSkills] = useState({});
  const [copySuccess, setCopySuccess] = useState('');

  useEffect(() => {
    if (currentPath) {
      const isShaPath = matchPath("/planner/:encoded", currentPath)
      if (isShaPath) {
        try {
          const sha = isShaPath.params.encoded
          const unpackedString = Buffer.from(sha, 'base64').toString('ascii');
          const parsed = JSON.parse(unpackedString)
          if (parsed) {
            setJob(parsed.jobId)
            setSkills(parsed.skillLevels)
          }
        } catch {
          // just give up
          navigate('/planner', { replace: true })
        }
      }
  }}, [currentPath, navigate])
  // Only depend on the path changing. Everything else is fine.

  const handlePackData = async () => {
    const skillLevelsClean =  Object.fromEntries(
      Object.entries(skillLevels).filter(([key, value]) => value !== 0)
    )
    const packed = JSON.stringify({
      "jobId": jobId,
      "skillLevels": skillLevelsClean
    })

    const base64String = Buffer.from(packed).toString('base64');

    if (base64String) {
      // Copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopySuccess('URL Copied!');
        setTimeout(() => {
          setCopySuccess('');
        }, 2000); // Reset message after 2 seconds
      } catch (err) {
        setCopySuccess('Failed to copy URL');
      }
      navigate(`/planner/${base64String}`, { replace: true });
    }

  }

  const jobList = jobData.jobs

  const onChangeJobHandler = (event) => {
    const jobId = parseInt(event.target.value);
    if (Object.keys(skillLevels).length !== 0) {
        if (window.confirm("Changing job will reset all skills. Continue?")) {
          setSkills({})
          setJob(jobId)
          window.scrollTo({ top: 0, left: 0})
        }
      } else {
        setSkills({})
        setJob(jobId)
        window.scrollTo({ top: 0, left: 0})
      }
  }
  
  const handleResetSkills = () => {
    if (window.confirm("Are you sure you want to reset all skills?")) {
      // Proceed with submission
      setSkills({})
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
