import './Skill.css';
import SkillSprite from '../skillsprite/SkillSprite';

function Skill({ 
  name: skillName, 
  max, 
  currentLevel,
  nextId, 
  nextLevel, 
  nextLevelCurrent,
  prevId, 
  prevLevel,
  prevLevelCurrent,
  spriteIndex,
  updateSkill
}) {

  let incrementButton, decrementButton;

  const handleIncrement = (increment) => {
    return () => {
      if (!currentLevel) {
        updateSkill(increment)
      } else {
        updateSkill(currentLevel + increment)
      }
    }
  }

  const canIncrease = () => {
    if (prevId) {
      return (prevLevelCurrent >= prevLevel)
    } else {
        return true
    }
  }

  const canDecrease = () => {
    if (nextId) {
      if (nextLevelCurrent) {
        return (nextLevelCurrent > 0 && currentLevel > nextLevel)
      } else {
        return true
      }
    } else {
      return true
    }
  }

  if (currentLevel < max && canIncrease()) {
    incrementButton = <span className="Skill-button" rel="button" onClick={handleIncrement(1)}>+</span>
  } else {
    incrementButton = <span className="Skill-button Skill-buttonDisabled" rel="button">+</span>
  }

  if (currentLevel > 0 && canDecrease()) {
    decrementButton = <span className="Skill-button" rel="button" onClick={handleIncrement(-1)}>-</span>
  } else {
    decrementButton = <span className="Skill-button Skill-buttonDisabled" rel="button">-</span>
  }

  const skillSpacer = () => {
    const isOver = currentLevel >= nextLevel ? {
      fontWeight: "bold",
      color: "green"
    } : {
      color: "grey"
    }
    if (nextId) {
      return <div className="Skill-connector" style={isOver}>Lv.{nextLevel}</div>
    } else {
      return <div className="Skill-spacer"/>
    }
  }

  return (
    <div className="Skill">
        <SkillSprite spriteIndex={spriteIndex} isDisabled={!canIncrease()}/>
        <div className="Skill-details">
            <div className="Skill-name">{skillName}</div>
            <div className="Skill-modifiers">
                {decrementButton}
                <div className="Skill-value">{currentLevel}/{max}</div>
                {incrementButton}
            </div>
        </div>
        {skillSpacer()}
    </div>
  );
}

export default Skill;