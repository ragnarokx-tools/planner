import "../skill/Skill.js"
import Skill from "../skill/Skill.js"
import "./job.css"



function Job({data: jobData, skillLevels, setSkills}) {

  const {id, name, skillTree, skills} = jobData

  const modifySpecificSkill = (skillObject) => 
    (value) => setSkills(prevSkills => {
      const {id, max} = skillObject
      return {
        ...prevSkills,
        [id]: Math.max(Math.min(max, value),0),
      }
    })

  const renderSkillsInTree = () => {
    if (!skills || !skillTree) {
      return <div>couldn't find skills</div>
    } else {
      const skillTreeItems = skillTree.map(skillId => {
        if (skillId > 0) {
          const skillObject = skills.find(obj => obj.id === skillId)
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
      return <div className="Job-skillGrid">{skillTreeItems}</div>
    }
  } 

  if (!skills) {
    return <div>no data for {name}</div>
  }

  const jobIcon = () => {
    return <div className="Job-icon">
        <span class={`icon-${name}`} role="img" aria-label={`${name}`}></span>
        {/* <img alt={name} src={`./jobicons/${id}.png`}/> */}
      </div>
  }

  return (
    <div className="Job">
      <div className="Job-header">
        {jobIcon()}
      </div>
      <div className="Job-skillTree">
        {renderSkillsInTree()}
      </div>
    </div>
  )
}

export default Job;