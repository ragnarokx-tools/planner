import './Skill.css';

function Skill({ data: skillData, skillLevelData, updateSkill }) {

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
    incrementButton = <button onClick={handleIncrement(1)}>+</button>
  } else {
    incrementButton = <button disabled={true}>+</button>
  }

  if (currentValue > 0 && canDecrease()) {
    decrementButton = <button onClick={handleIncrement(-1)}>-</button>
  } else {
    decrementButton = <button disabled={true}>-</button>
  }

  // not working
  const skillIcon = () => {
    return <div className="Skill-icon">
        <span class={`icon-${skillName}`} role="img" aria-label={`${skillName}`}></span>
        {/* <icon alt={skillName} src={`./skillicons/${id}.png`}/> */}
      </div>
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