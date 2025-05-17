import './Skill.css';

function Skill({ data: skillData, skillLevelData, updateSkill, iconStyle }) {

  if (!skillData) {
    return <div>no data found for skill</div>
  }

  const {
    id, 
    name: skillName, 
    max, 
    nextId, 
    nextLevel, 
    prevId, 
    prevLevel
  } = skillData;
  const currentValue = skillLevelData[id] ? skillLevelData[id] : 0
  let incrementButton, decrementButton;

  const handleIncrement = (increment) => {
    return () => {
      if (!currentValue) {
        updateSkill(increment)
      } else {
        updateSkill(currentValue + increment)
      }
    }
  }

  const canIncrease = () => {
    if (prevId) {
      return (skillLevelData[prevId] && skillLevelData[prevId] >= prevLevel)
    } else {
        return true
    }
  }

  const canDecrease = () => {
    if (nextId) {
      if (skillLevelData[nextId]) {
        return (skillLevelData[nextId] > 0 && currentValue > nextLevel)
      } else {
        return true
      }
    } else {
      return true
    }
  }

  if (currentValue < max && canIncrease()) {
    incrementButton = <span className="Skill-button" rel="button" onClick={handleIncrement(1)}>+</span>
  } else {
    incrementButton = <span className="Skill-button Skill-buttonDisabled" rel="button">+</span>
  }

  if (currentValue > 0 && canDecrease()) {
    decrementButton = <span className="Skill-button" rel="button" onClick={handleIncrement(-1)}>-</span>
  } else {
    decrementButton = <span className="Skill-button Skill-buttonDisabled" rel="button">-</span>
  }

  const skillIcon = () => {
    let newStyle = {
      ...iconStyle 
    }
    let filter = "grayscale(100%)"
    if (canIncrease()) {
      filter = ""
    }
    newStyle["filter"] = filter
    return <div 
      className="Skill-icon"
      style={newStyle}
    ></div>
  }

  return (
    <div className="Skill">
        {skillIcon()}
        <div className="Skill-details">
            <div className="Skill-name">{skillName}</div>
            <div className="Skill-modifiers">
                {decrementButton}
                <div className="Skill-value">{currentValue}/{max}</div>
                {incrementButton}
            </div>
        </div>
    </div>
  );
}

export default Skill;