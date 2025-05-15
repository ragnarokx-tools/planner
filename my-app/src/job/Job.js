import { useState } from 'react';
import "../skill/Skill.js"
import Skill from "../skill/Skill.js"
import "./job.css"

function Job({name, data}) {
  const [skillLevels, setSkills] = useState({});

  const modifySpecificSkill = (name) => 
    (value) => setSkills(prevSkills => ({
      ...prevSkills,
      [name]: value
    }));

  const reset = () => {
    return <div onClick={() => setSkills({})}>reset</div>
  }

  const renderSkills = (jobData) => {
    if (!jobData) {
      return <div>couldn't find skills</div>
    } else {
      const skills = jobData.map(skillObject => {
        return <Skill 
          data={skillObject} 
          skillState={skillLevels}
          updateSkill={modifySpecificSkill(skillObject.name)}
        />
      })
      return <div>{skills}</div>
    }
  } 

  if (!data) {
    return <div>no data for {name}</div>
  }

  return (
    <div className="Job">
      <div><b>{name}</b></div>
      {renderSkills(data.skills)}
      {reset()}
    </div>
  )
}

export default Job;