import Skill from "../skill/Skill.js"
import "./job.css"

function Job({data: jobData, skillLevels, setSkills}) {

  const {name, skillTree, skills} = jobData

  const modifySpecificSkill = (skillId, max) => 
    (newValue) => setSkills(prevSkills => {
      // const {id: skillId, max} = skillObject
      let {[skillId]: _, ...rest} = prevSkills
      if (newValue <= 0) {
        return rest
      } else {
        return {
          ...rest,
          [skillId]: Math.max(Math.min(max, newValue),0),
        }
      }
    })

  const renderSkillsInTree = () => {
    if (!skills || !skillTree) {
      return <div>couldn't find skills</div>
    } else {
      const skillTreeItems = skillTree.map(skillId => {
        if (skillId > 0) {
          const currentLevel = skillLevels[skillId] ? skillLevels[skillId] : 0
          const skillObject = skills[skillId]
          const nextSkillExists = skillObject.nextId ? skills[skillObject.nextId] : null
          const prevSkillExists = skillObject.prevId ? skills[skillObject.prevId] : null
          return <Skill
            name={skillObject.name}
            max={skillObject.max}
            currentLevel={currentLevel}
            // filter out hanging references from shared skills
            nextId={nextSkillExists ? skillObject.nextId : null}
            nextLevel={nextSkillExists ? skillObject.nextLevel : null}
            nextLevelCurrent={nextSkillExists ? skillLevels[skillObject.nextId]: null}
            prevId={prevSkillExists ? skillObject.prevId : null} 
            prevLevel={prevSkillExists ? skillObject.prevLevel : null}
            prevLevelCurrent={prevSkillExists ? skillLevels[skillObject.prevId]: null}
            spriteIndex={skillObject.spriteIndex}
            skillLevelData={skillLevels}
            updateSkill={modifySpecificSkill(skillId, skillObject.max)}
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
          return <div className="Job-spacer"/>
        }
      })
      return <div className="Job-skillGrid">{skillTreeItems}</div>
    }
  } 

  if (!skills) {
    return <div>no data for {name}</div>
  }

  const jobTitle = () => {
    return <div className="Job-title">
        {name}
      </div>
  }

  return (
    <div className="Job">
      <div className="Job-header">
        {jobTitle()}
      </div>
      {renderSkillsInTree()}
    </div>
  )
}

export default Job;