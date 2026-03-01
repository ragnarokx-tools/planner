import './Skill.css';
import SkillSprite from '../skillsprite/SkillSprite';

function Skill({ 
  name: skillName, 
  max, 
  currentLevel = 0,
  nextId, 
  nextLevel, 
  nextLevelCurrent,
  prevId, 
  prevLevel,
  prevLevelCurrent,
  spriteIndex,
  updateSkill
}) {

  const handleIncrement = (increment) => () => {
    updateSkill((currentLevel || 0) + increment);
  };

  const canIncrease = () => {
    return !prevId || (prevLevelCurrent >= prevLevel);
  };

  const canDecrease = () => {
    if (!nextId) return true;
    return !nextLevelCurrent || (nextLevelCurrent > 0 && currentLevel > nextLevel);
  };

  const canIncreaseSkill = canIncrease();
  const canDecreaseSkill = canDecrease();

  const incrementButton = (
    <button 
      className={`Skill-button ${currentLevel >= max || !canIncreaseSkill ? 'Skill-buttonDisabled' : ''}`}
      onClick={handleIncrement(1)}
      disabled={currentLevel >= max || !canIncreaseSkill}
      aria-label={`Increase ${skillName}`}
    >
      +
    </button>
  );

  const decrementButton = (
    <button 
      className={`Skill-button ${currentLevel <= 0 || !canDecreaseSkill ? 'Skill-buttonDisabled' : ''}`}
      onClick={handleIncrement(-1)}
      disabled={currentLevel <= 0 || !canDecreaseSkill}
      aria-label={`Decrease ${skillName}`}
    >
      -
    </button>
  );

  const skillSpacer = () => {
    if (!nextId) {
      return <div className="Skill-spacer" />;
    }

    const isOver = currentLevel >= nextLevel;
    const className = `Skill-connector ${isOver ? 'is-met' : ''}`;

    return <div className={className} data-level={`Lv.${nextLevel}`} />;
  };

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