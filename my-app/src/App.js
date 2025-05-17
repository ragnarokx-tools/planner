import { useState } from 'react';
import './App.css';
import jobData from './resources/jobs.json'
import skillData from './resources/skills.json'
import Job from './job/Job.js';

function App() {
  const [job, setJob] = useState("Knight");
  const [skillLevels, setSkills] = useState({});

  const onChangeJobHandler = (event) => {
    const jobName = event.target.value;
    if (Object.keys(skillLevels).length !== 0) {
        if (window.confirm("Changing job will reset all skills. Continue?")) {
          setSkills({})
          setJob(jobName)
        }
      } else {
        setSkills({})
        setJob(jobName)
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
  const getJobDataByName = (jobName) => {
    const jobObject = jobData.jobs.find((job) => jobName === job.name)
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
    <select name="job" value={job} defaultValue="Knight" onChange={onChangeJobHandler}>
      {jobData.jobs.map((job) => <option value={`${job.name}`}>{job.name}</option>)}
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
      {/* {renderJobs (allJobsAndSkillsData)} */}
      {header()}
      <div className="App-jobContent">
      { job ?  
        <Job 
          data={getJobDataByName(job)}
          skillLevels={skillLevels}
          setSkills={setSkills} 
        /> : null }
      </div>
    </div>
  );
}

export default App;
