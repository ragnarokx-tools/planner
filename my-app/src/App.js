import { useState } from 'react';
import './App.css';
import jobData from './resources/skills.json'
import Job from './job/Job.js';

function App() {
  const [job, setJob] = useState("Knight");

  const jobHandler = (jobName) => {
    return _ => setJob(jobName)
  }

  const renderJobs = (data) => {
    if (!data) {
      return null
    } else {
      const listOfJobs = data.jobs.map(jobObject => {
        return (<li onClick={jobHandler(jobObject.name)}>{jobObject.name}</li>)
      })
      return <ul>{listOfJobs}</ul>
    }
  }

  const getJobByName = (jobName, jobDataJobs) => {
    return jobDataJobs.find((job) => jobName === job.name)
  }

  if (!jobData) {
    return <div>Loading static data... Try reloading if it doesn't work.</div>
  }

  return (
    <div className="App">
      {renderJobs (jobData)}
      { job ?  <Job name={job} data={getJobByName(job, jobData.jobs)} /> : null }
    </div>
  );
}

export default App;
