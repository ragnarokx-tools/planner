import { useReducer, useMemo } from 'react';
import jobData from '../resources/jobs.json';
import skillData from '../resources/skills.json';

const initialState = {
  jobId: 1,
  skillLevels: {},
  copySuccess: ''
};

const actionTypes = {
  SET_JOB: 'SET_JOB',
  SET_SKILL_LEVEL: 'SET_SKILL_LEVEL',
  RESET_SKILLS: 'RESET_SKILLS',
  LOAD_BUILD: 'LOAD_BUILD',
  SET_COPY_SUCCESS: 'SET_COPY_SUCCESS'
};

function skillPlannerReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_JOB:
      return {
        ...state,
        jobId: action.payload,
        skillLevels: {} // Reset skills when changing job
      };
    
    case actionTypes.SET_SKILL_LEVEL: {
      const { skillId, level, max } = action.payload;
      
      // Remove skill if level is 0 or below
      if (level <= 0) {
        const { [skillId]: _, ...rest } = state.skillLevels;
        return { ...state, skillLevels: rest };
      }
      
      // Clamp level between 0 and max
      const clampedLevel = Math.max(0, Math.min(max, level));
      
      return {
        ...state,
        skillLevels: {
          ...state.skillLevels,
          [skillId]: clampedLevel
        }
      };
    }
    
    case actionTypes.RESET_SKILLS:
      return {
        ...state,
        skillLevels: {}
      };
    
    case actionTypes.LOAD_BUILD:
      return {
        ...state,
        jobId: action.payload.jobId,
        skillLevels: action.payload.skillLevels
      };
    
    case actionTypes.SET_COPY_SUCCESS:
      return {
        ...state,
        copySuccess: action.payload
      };
    
    default:
      return state;
  }
}

export function useSkillPlanner() {
  const [state, dispatch] = useReducer(skillPlannerReducer, initialState);

  // Memoized job data
  const currentJob = useMemo(() => {
    return jobData.jobs.find(job => job.id === state.jobId);
  }, [state.jobId]);

  // Memoized skills for current job
  const currentSkills = useMemo(() => {
    if (!currentJob?.skillTree) return {};
    
    const skills = {};
    skillData.forEach((skill) => {
      if (currentJob.skillTree.includes(skill.id)) {
        const { id, ...skillRest } = skill;
        skills[id] = skillRest;
      }
    });
    return skills;
  }, [currentJob]);

  // Memoized job data with skills
  const jobWithSkills = useMemo(() => {
    return {
      ...currentJob,
      skills: currentSkills
    };
  }, [currentJob, currentSkills]);

  // Calculate total skill points
  const totalSkillPoints = useMemo(() => {
    return Object.values(state.skillLevels).reduce((sum, level) => sum + level, 0);
  }, [state.skillLevels]);

  // Actions
  const actions = {
    setJob: (jobId) => {
      dispatch({ type: actionTypes.SET_JOB, payload: jobId });
    },

    setSkillLevel: (skillId, level, max) => {
      dispatch({ 
        type: actionTypes.SET_SKILL_LEVEL, 
        payload: { skillId, level, max } 
      });
    },

    resetSkills: () => {
      dispatch({ type: actionTypes.RESET_SKILLS });
    },

    loadBuild: (jobId, skillLevels) => {
      dispatch({ 
        type: actionTypes.LOAD_BUILD, 
        payload: { jobId, skillLevels } 
      });
    },

    setCopySuccess: (message) => {
      dispatch({ type: actionTypes.SET_COPY_SUCCESS, payload: message });
    }
  };

  return {
    // State
    jobId: state.jobId,
    skillLevels: state.skillLevels,
    copySuccess: state.copySuccess,
    
    // Computed values
    currentJob,
    currentSkills,
    jobWithSkills,
    totalSkillPoints,
    jobList: jobData.jobs,
    
    // Actions
    ...actions
  };
}
