import { useState } from 'react';
import "../skill/Skill.js"
import Skill from "../skill/Skill.js"
import "./job.css"



function Job({data: jobData, skillLevels, setSkills}) {

  const {name} = jobData

  const modifySpecificSkill = (skillObject) => 
    (value) => setSkills(prevSkills => {
      const {id, max} = skillObject
      return {
        ...prevSkills,
        [id]: Math.max(Math.min(max, value),0),
      }
    })

  const handleResetSkills = () => {
    if (window.confirm("Are you sure you want to reset all skills?")) {
      // Proceed with submission
      setSkills({})
    } else {
    }  
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
            skillLevelData={skillLevels}
            updateSkill={modifySpecificSkill(skillObject)}
          />
        } else if (skillId < 0) {
          if (skillId === -2) {
            return <div className="Job-connector"/>
          } else if (skillId === -3) {
            return <div className="Job-connector"><hr/></div>
          } else if (skillId === -1) {
            return <div className="Job-spacer"><hr/></div>
          }
        } else {
          return <div className="Job-spacer"></div>
        }
      })
      return <div className="Job-skillGrid">{layoutItems}</div>
    }
  } 

  if (!jobData) {
    return <div>no data for {name}</div>
  }

  return (
    <div className="Job">
      <div>
        <b>{name}</b> 
        {renderResetButton()}
      </div>
      {renderTotalSkillPointsUsed()}
      {renderSkills(jobData.layout, jobData.skills)}
    </div>
  )
}

export default Job;