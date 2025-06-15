import * as React from 'react';

interface AssessmentResults {
  anxiety: number;
  depression: number;
  stress: number;
  sleep: number;
  social: number;
  overall: number;
}

interface UserDataContextType {
  assessment: AssessmentResults | null;
  addAssessment: (results: AssessmentResults) => void;
}

const UserDataContext = React.createContext<UserDataContextType | undefined>(undefined);

export const UserDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assessment, setAssessment] = React.useState<AssessmentResults | null>(null);

  const addAssessment = (results: AssessmentResults) => {
    setAssessment(results);
  };

  return (
    <UserDataContext.Provider value={{ assessment, addAssessment }}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = React.useContext(UserDataContext);
  if (context === undefined) {
    throw new Error('useUserData must be used within a UserDataProvider');
  }
  return context;
}; 