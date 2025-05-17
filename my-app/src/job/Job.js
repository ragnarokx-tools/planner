import Skill from "../skill/Skill.js"
import "./job.css"

function Job({data: jobData, skillLevels, setSkills, spriteSheet}) {

  const {id: jobId, name, skillTree, skills} = jobData

  const modifySpecificSkill = (skillObject) => 
    (value) => setSkills(prevSkills => {
      const {id: skillId, max} = skillObject
      return {
        ...prevSkills,
        [skillId]: Math.max(Math.min(max, value),0),
      }
    })

  const calculatePositionInSpriteSheet = (skillId, jobId) => {
    // all sprite sheets are constructed using the following:
    // 5 columns
    // 100px image size
    const entryNumber = skillId - jobId*1000
    const offsetX = entryNumber % 5
    const offsetY = Math.floor(entryNumber / 5)
    const style = {
      backgroundImage: `url(${spriteSheet})`,
      backgroundPosition: `-${offsetX*100}px -${offsetY*100}px`,
      width: `100px`,
      height: `100px`,
    };
    return style
  }

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
            iconStyle={calculatePositionInSpriteSheet(skillId, jobId)}
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
        <span className={`icon-${name}`} role="img" aria-label={`${name}`}></span>
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