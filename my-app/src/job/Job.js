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
    return <button onClick={() => setSkills({})}>reset</button>
  }

  const totalSkillPoints = () => {
    let sum = 0;
    if(skillLevels) {
      Object.values(skillLevels).map((level) => 
        sum += level
      )
    }
    return <div>{sum}</div>
  }

  const renderSkills = (layout, jobData) => {
    if (!jobData || !layout) {
      return <div>couldn't find skills</div>
    } else {
      const layoutItems = layout.map(skillId => {
        if (skillId > 0) {
          const skillObject = jobData.find(obj => obj.id === skillId)
          return <Skill 
            data={skillObject} 
            skillState={skillLevels}
            updateSkill={modifySpecificSkill(skillObject.name)}
          />
        } else if (skillId === -2) {
          return (<div className="Job-spacer">
              <div className="Job-connector"/>
              <div className="Job-emptySpace"/>
            </div>)
        } else {
          return <div className="Job-spacer"/>
        }
      })
      // const skills = jobData.map(skillObject => {
      //   return <Skill 
      //     data={skillObject} 
      //     skillState={skillLevels}
      //     updateSkill={modifySpecificSkill(skillObject.name)}
      //   />
      // })
      return <div className="Job-skillGrid">{layoutItems}</div>
    }
  } 

  if (!data) {
    return <div>no data for {name}</div>
  }

  return (
    <div className="Job">
      <div>
        <b>{name}</b> 
        {reset()}
      </div>
      {totalSkillPoints()}
      {renderSkills(data.layout, data.skills)}
    </div>
  )
}

export default Job;