import { useState } from 'react';
import './App.css';
import jobData from './resources/jobs.json'
import skillData from './resources/skills.json'
import Job from './job/Job.js';

function App() {
  const [jobId, setJob] = useState(1);
  const [skillLevels, setSkills] = useState({});

  const jobList = jobData.jobs

  function importAll(r) {
    let sheetById = {}
    r.keys().forEach( key => {
      const numberMatch = key.match(/\d+/)
      const imgId = numberMatch ? numberMatch[0] : null;
      if (imgId) {
        sheetById[imgId] = r(key)
      }
    })
    return sheetById;
  }

  const spriteSheetsById = importAll(require.context('./icons/', false, /\.(png)$/));

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
          {renderResetButton()}
        </div>
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
          spriteSheet={spriteSheetsById[jobId]}
        /> : null }
      </div>
    </div>
  );
}

export default App;
