import Skill from "../skill/Skill.js"
import "./job.css"

function Job({data: jobData, skillLevels, setSkills, spriteSheet}) {

  const {name, skillTree, skills} = jobData

  const modifySpecificSkill = (skillObject) => 
    (value) => setSkills(prevSkills => {
      const {id: skillId, max} = skillObject
      return {
        ...prevSkills,
        [skillId]: Math.max(Math.min(max, value),0),
      }
    })

  const iconSize = 100
  const renderSprite = (skillId, skillObject) => {
    // all sprite sheets are constructed using the following:
    // 29 columns
    // 100px fixed width
    // pre-determined sprite Index (i will be sad later)
    if (skillObject && skillObject.spriteIndex >= 0) {
      const spriteIndex = skillObject.spriteIndex
      const offsetX = spriteIndex % 20
      const offsetY = Math.floor(spriteIndex / 20)
      let style = {
        backgroundImage: `url(${spriteSheet})`,
        backgroundPosition: `-${offsetX*iconSize}px -${offsetY*iconSize}px`,
        width: `${iconSize}px`,
        height: `${iconSize}px`
      };
      return style
    } else {
      return null
    }
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
            iconStyle={renderSprite(skillId, skillObject)}
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