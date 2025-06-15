import React from 'react';
import { useUserData } from '@/context/UserDataContext';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ASSESSMENT_SECTIONS = {
  english: [
    {
      id: 'intro',
      title: 'Mental Health Assessment',
      description: 'This assessment will help us understand your current mental health status. It takes about 5-10 minutes to complete. Your answers are confidential and will be used to provide personalized recommendations.',
      type: 'intro'
    },
    {
      id: 'anxiety',
      title: 'Anxiety Assessment',
      description: 'The following questions relate to anxiety symptoms you may have experienced in the past two weeks.',
      questions: [
        {
          id: 'anxiety_1',
          text: 'How often have you been feeling nervous, anxious, or on edge?',
          type: 'scale'
        },
        {
          id: 'anxiety_2',
          text: 'How often have you not been able to stop or control worrying?',
          type: 'scale'
        },
        {
          id: 'anxiety_3',
          text: 'How often have you had trouble relaxing?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'depression',
      title: 'Depression Assessment',
      description: 'The following questions relate to depressive symptoms you may have experienced in the past two weeks.',
      questions: [
        {
          id: 'depression_1',
          text: 'How often have you had little interest or pleasure in doing things?',
          type: 'scale'
        },
        {
          id: 'depression_2',
          text: 'How often have you been feeling down, depressed, or hopeless?',
          type: 'scale'
        },
        {
          id: 'depression_3',
          text: 'How often have you had trouble falling or staying asleep, or sleeping too much?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'stress',
      title: 'Stress Assessment',
      description: 'The following questions relate to stress levels you may have experienced in the past two weeks.',
      questions: [
        {
          id: 'stress_1',
          text: 'How often have you found it difficult to cope with all the things you had to do?',
          type: 'scale'
        },
        {
          id: 'stress_2',
          text: 'How often have you felt irritable or angry?',
          type: 'scale'
        },
        {
          id: 'stress_3',
          text: 'How often have you felt overwhelmed?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'sleep',
      title: 'Sleep Patterns',
      description: 'The following questions relate to your sleep patterns over the past two weeks.',
      questions: [
        {
          id: 'sleep_1',
          text: 'How would you rate your overall sleep quality?',
          type: 'scale'
        },
        {
          id: 'sleep_2',
          text: 'How often have you had trouble falling asleep or staying asleep?',
          type: 'scale',
          inverted: true
        },
        {
          id: 'sleep_3',
          text: 'How rested do you feel when you wake up in the morning?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'social',
      title: 'Social Relationships',
      description: 'The following questions relate to your social relationships and support system.',
      questions: [
        {
          id: 'social_1',
          text: 'How satisfied are you with your relationships with friends and family?',
          type: 'scale'
        },
        {
          id: 'social_2',
          text: 'How often do you feel lonely or isolated?',
          type: 'scale',
          inverted: true
        },
        {
          id: 'social_3',
          text: 'How comfortable do you feel reaching out for support when needed?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'emergency',
      title: 'Crisis Assessment',
      description: 'These questions help us determine if you need immediate support. Please answer honestly.',
      questions: [
        {
          id: 'emergency_1',
          text: 'In the past two weeks, have you had thoughts that you would be better off dead or of hurting yourself in some way?',
          type: 'boolean'
        },
        {
          id: 'emergency_2',
          text: 'Do you currently have a plan to harm yourself or end your life?',
          type: 'boolean'
        }
      ]
    },
    {
      id: 'completion',
      title: 'Assessment Complete',
      description: 'Thank you for completing the assessment. Your responses will help us provide personalized recommendations for your mental health journey.',
      type: 'completion'
    }
  ],
  hindi: [
    {
      id: 'intro',
      title: 'मानसिक स्वास्थ्य मूल्यांकन',
      description: 'यह मूल्यांकन आपके वर्तमान मानसिक स्वास्थ्य की स्थिति को समझने में हमारी मदद करेगा। इसे पूरा करने में लगभग 5-10 मिनट लगेंगे। आपके उत्तर गोपनीय हैं और व्यक्तिगत सिफारिशें प्रदान करने के लिए उपयोग किए जाएंगे।',
      type: 'intro'
    },
    {
      id: 'anxiety',
      title: 'चिंता मूल्यांकन',
      description: 'निम्नलिखित प्रश्न पिछले दो सप्ताह में आपके द्वारा अनुभव किए गए चिंता के लक्षणों से संबंधित हैं।',
      questions: [
        {
          id: 'anxiety_1',
          text: 'आप कितनी बार घबराए हुए, चिंतित या तनावग्रस्त महसूस करते हैं?',
          type: 'scale'
        },
        {
          id: 'anxiety_2',
          text: 'आप कितनी बार चिंता को रोकने या नियंत्रित करने में असमर्थ रहे हैं?',
          type: 'scale'
        },
        {
          id: 'anxiety_3',
          text: 'आप कितनी बार आराम करने में परेशानी महसूस करते हैं?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'depression',
      title: 'अवसाद मूल्यांकन',
      description: 'निम्नलिखित प्रश्न पिछले दो सप्ताह में आपके द्वारा अनुभव किए गए अवसाद के लक्षणों से संबंधित हैं।',
      questions: [
        {
          id: 'depression_1',
          text: 'आप कितनी बार चीजों में रुचि या आनंद महसूस करने में कमी महसूस करते हैं?',
          type: 'scale'
        },
        {
          id: 'depression_2',
          text: 'आप कितनी बार उदास, निराश या निराशाजनक महसूस करते हैं?',
          type: 'scale'
        },
        {
          id: 'depression_3',
          text: 'आप कितनी बार सोने में या सोते रहने में परेशानी महसूस करते हैं, या बहुत अधिक सोते हैं?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'stress',
      title: 'तनाव मूल्यांकन',
      description: 'निम्नलिखित प्रश्न पिछले दो सप्ताह में आपके द्वारा अनुभव किए गए तनाव के स्तर से संबंधित हैं।',
      questions: [
        {
          id: 'stress_1',
          text: 'आप कितनी बार अपने सभी कार्यों को संभालने में कठिनाई महसूस करते हैं?',
          type: 'scale'
        },
        {
          id: 'stress_2',
          text: 'आप कितनी बार चिड़चिड़े या क्रोधित महसूस करते हैं?',
          type: 'scale'
        },
        {
          id: 'stress_3',
          text: 'आप कितनी बार अभिभूत महसूस करते हैं?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'sleep',
      title: 'नींद के पैटर्न',
      description: 'निम्नलिखित प्रश्न पिछले दो सप्ताह में आपकी नींद के पैटर्न से संबंधित हैं।',
      questions: [
        {
          id: 'sleep_1',
          text: 'आप अपनी समग्र नींद की गुणवत्ता को कैसे आंकते हैं?',
          type: 'scale'
        },
        {
          id: 'sleep_2',
          text: 'आप कितनी बार सोने में या सोते रहने में परेशानी महसूस करते हैं?',
          type: 'scale',
          inverted: true
        },
        {
          id: 'sleep_3',
          text: 'सुबह उठने पर आप कितना आराम महसूस करते हैं?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'social',
      title: 'सामाजिक संबंध',
      description: 'निम्नलिखित प्रश्न आपके सामाजिक संबंधों और सहायता प्रणाली से संबंधित हैं।',
      questions: [
        {
          id: 'social_1',
          text: 'आप अपने दोस्तों और परिवार के साथ संबंधों से कितने संतुष्ट हैं?',
          type: 'scale'
        },
        {
          id: 'social_2',
          text: 'आप कितनी बार अकेला या अलग-थलग महसूस करते हैं?',
          type: 'scale',
          inverted: true
        },
        {
          id: 'social_3',
          text: 'जरूरत पड़ने पर सहायता मांगने में आप कितना सहज महसूस करते हैं?',
          type: 'scale'
        }
      ]
    },
    {
      id: 'emergency',
      title: 'संकट मूल्यांकन',
      description: 'ये प्रश्न हमें यह निर्धारित करने में मदद करते हैं कि क्या आपको तत्काल सहायता की आवश्यकता है। कृपया ईमानदारी से उत्तर दें।',
      questions: [
        {
          id: 'emergency_1',
          text: 'पिछले दो सप्ताह में, क्या आपके मन में यह विचार आया है कि आप मर जाएं या खुद को नुकसान पहुंचाएं?',
          type: 'boolean'
        },
        {
          id: 'emergency_2',
          text: 'क्या आपके पास वर्तमान में खुद को नुकसान पहुंचाने या जीवन समाप्त करने की योजना है?',
          type: 'boolean'
        }
      ]
    },
    {
      id: 'completion',
      title: 'मूल्यांकन पूर्ण',
      description: 'मूल्यांकन पूरा करने के लिए धन्यवाद। आपके उत्तर हमें आपकी मानसिक स्वास्थ्य यात्रा के लिए व्यक्तिगत सिफारिशें प्रदान करने में मदद करेंगे।',
      type: 'completion'
    }
  ]
};

const SCALE_LABELS = {
  english: {
    1: 'Not at all',
    2: 'Rarely',
    3: 'Sometimes',
    4: 'Often',
    5: 'Very frequently',
    6: 'Almost constantly',
    7: 'Constantly',
    8: 'Severely',
    9: 'Extremely',
    10: 'Completely'
  },
  hindi: {
    1: 'बिल्कुल नहीं',
    2: 'कभी-कभी',
    3: 'कभी-कभार',
    4: 'अक्सर',
    5: 'बहुत अधिक',
    6: 'लगभग हमेशा',
    7: 'हमेशा',
    8: 'गंभीर रूप से',
    9: 'अत्यधिक',
    10: 'पूरी तरह से'
  }
};

interface AssessmentProps {
  language?: 'english' | 'hindi';
}

const Assessment: React.FC<AssessmentProps> = ({ language = 'english' }) => {
  const { addAssessment } = useUserData();
  const [currentSectionIndex, setCurrentSectionIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [showEmergencyResources, setShowEmergencyResources] = React.useState(false);
  
  const currentSection = ASSESSMENT_SECTIONS[language][currentSectionIndex];
  const scaleLabels = SCALE_LABELS[language];
  
  const handleNext = () => {
    if (currentSectionIndex < ASSESSMENT_SECTIONS[language].length - 1) {
      // Check for emergency conditions
      if (currentSection.id === 'emergency') {
        if (answers['emergency_1'] === 1 || answers['emergency_2'] === 1) {
          setShowEmergencyResources(true);
          return;
        }
      }
      
      setCurrentSectionIndex(currentSectionIndex + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleScaleAnswer = (questionId: string, value: number, inverted: boolean = false) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: inverted ? 11 - value : value
    }));
  };
  
  const handleBooleanAnswer = (questionId: string, value: boolean) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value ? 1 : 0
    }));
  };
  
  const isCurrentSectionComplete = () => {
    if (currentSection.type === 'intro' || currentSection.type === 'completion') {
      return true;
    }
    
    if (!currentSection.questions) {
      return false;
    }
    
    return currentSection.questions.every(question => 
      answers[question.id] !== undefined
    );
  };
  
  const calculateResults = () => {
    const anxietyScore = Math.round((
      (answers['anxiety_1'] || 0) + 
      (answers['anxiety_2'] || 0) + 
      (answers['anxiety_3'] || 0)
    ) / 3);
    
    const depressionScore = Math.round((
      (answers['depression_1'] || 0) + 
      (answers['depression_2'] || 0) + 
      (answers['depression_3'] || 0)
    ) / 3);
    
    const stressScore = Math.round((
      (answers['stress_1'] || 0) + 
      (answers['stress_2'] || 0) + 
      (answers['stress_3'] || 0)
    ) / 3);
    
    const sleepScore = Math.round((
      (answers['sleep_1'] || 0) + 
      (answers['sleep_2'] || 0) + 
      (answers['sleep_3'] || 0)
    ) / 3);
    
    const socialScore = Math.round((
      (answers['social_1'] || 0) + 
      (answers['social_2'] || 0) + 
      (answers['social_3'] || 0)
    ) / 3);
    
    const overallScore = Math.round((
      (11 - anxietyScore) + 
      (11 - depressionScore) + 
      (11 - stressScore) + 
      sleepScore + 
      socialScore
    ) / 5);
    
    return {
      anxiety: anxietyScore,
      depression: depressionScore,
      stress: stressScore,
      sleep: sleepScore,
      social: socialScore,
      overall: overallScore
    };
  };
  
  const handleComplete = () => {
    const results = calculateResults();
    addAssessment(results);
    setCurrentSectionIndex(0); // Reset to start
  };
  
  const renderQuestion = (question: any) => {
    if (question.type === 'scale') {
      return (
        <div key={question.id} className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor={question.id} className="text-lg font-medium text-neutral-800">
              {question.text}
            </label>
            <button 
              type="button" 
              className="text-neutral-500 hover:text-primary-600"
              title="Learn more about this question"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="mt-2">
            <div className="flex justify-between mb-1">
              <span className="text-sm text-neutral-500">Not at all</span>
              <span className="text-sm text-neutral-500">Severely</span>
            </div>
            <div className="flex justify-between space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`
                    flex-1 h-12 rounded-md focus:outline-none transition-all
                    ${answers[question.id] === (question.inverted ? 11 - value : value)
                      ? 'bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-2'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                    }
                  `}
                  onClick={() => handleScaleAnswer(question.id, value, question.inverted)}
                  aria-label={`${scaleLabels[value] || value}`}
                >
                  {value}
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs text-neutral-500">
                {scaleLabels[1]}
              </span>
              <span className="text-xs text-neutral-500">
                {scaleLabels[10]}
              </span>
            </div>
          </div>
        </div>
      );
    } else if (question.type === 'boolean') {
      return (
        <div key={question.id} className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <label className="text-lg font-medium text-neutral-800">
              {question.text}
            </label>
            <button 
              type="button" 
              className="text-neutral-500 hover:text-primary-600"
              title="Learn more about this question"
            >
              <HelpCircle className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="button"
              className={`
                flex-1 py-3 px-4 rounded-md border focus:outline-none transition-all
                ${answers[question.id] === 0
                  ? 'bg-primary-50 border-primary-300 text-primary-700 ring-2 ring-primary-300 ring-offset-2'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }
              `}
              onClick={() => handleBooleanAnswer(question.id, false)}
            >
              No
            </button>
            <button
              type="button"
              className={`
                flex-1 py-3 px-4 rounded-md border focus:outline-none transition-all
                ${answers[question.id] === 1
                  ? 'bg-primary-50 border-primary-300 text-primary-700 ring-2 ring-primary-300 ring-offset-2'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }
              `}
              onClick={() => handleBooleanAnswer(question.id, true)}
            >
              Yes
            </button>
          </div>
        </div>
      );
    }
    
    return null;
  };
  
  const renderEmergencyResources = () => {
    const resources = {
      english: {
        title: 'Important Notice',
        message: 'Based on your responses, we recommend you speak with someone right away. Here are resources that can help you immediately:',
        lifeline: 'National Suicide Prevention Lifeline:',
        crisisText: 'Crisis Text Line:',
        emergency: 'Emergency Services:',
        continue: 'You can continue with the assessment, but please reach out for help as soon as possible.',
        back: 'Back to Assessment',
        continueButton: 'Continue'
      },
      hindi: {
        title: 'महत्वपूर्ण सूचना',
        message: 'आपके उत्तरों के आधार पर, हम अनुशंसा करते हैं कि आप तुरंत किसी से बात करें। यहां कुछ संसाधन हैं जो आपकी तुरंत मदद कर सकते हैं:',
        lifeline: 'राष्ट्रीय आत्महत्या रोकथाम हेल्पलाइन:',
        crisisText: 'संकट टेक्स्ट लाइन:',
        emergency: 'आपातकालीन सेवाएं:',
        continue: 'आप मूल्यांकन जारी रख सकते हैं, लेकिन कृपया जल्द से जल्द मदद लें।',
        back: 'मूल्यांकन पर वापस जाएं',
        continueButton: 'जारी रखें'
      }
    };

    const t = resources[language];

    return (
      <div className="slide-up">
        <div className="bg-error-50 border border-error-100 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertTriangle className="h-6 w-6 text-error-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-error-800 mb-2">{t.title}</h3>
              <p className="text-error-700 mb-4">{t.message}</p>
              <ul className="space-y-3 mb-4">
                <li className="flex items-center">
                  <span className="bg-white p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-success-600" />
                  </span>
                  <span className="text-error-700">
                    <strong>{t.lifeline}</strong> 988 या 1-800-273-8255
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-success-600" />
                  </span>
                  <span className="text-error-700">
                    <strong>{t.crisisText}</strong> HOME को 741741 पर टेक्स्ट करें
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white p-2 rounded-full mr-3">
                    <Check className="h-4 w-4 text-success-600" />
                  </span>
                  <span className="text-error-700">
                    <strong>{t.emergency}</strong> 911 पर कॉल करें या निकटतम आपातकालीन कक्ष में जाएं
                  </span>
                </li>
              </ul>
              <p className="text-error-700 text-sm">{t.continue}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => setShowEmergencyResources(false)}
          >
            {t.back}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            {t.continueButton}
          </button>
        </div>
      </div>
    );
  };
  
  if (showEmergencyResources) {
    return (
      <Card className="glass-card border-white/10 rounded-2xl shadow-lg-glass">
        <CardContent className="p-6">
          {renderEmergencyResources()}
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="glass-card border-white/10 rounded-2xl shadow-lg-glass">
      <CardContent className="p-6">
        <div className="slide-up max-w-2xl mx-auto">
          <div className="mb-8">
            {/* Progress bar */}
            <div className="w-full bg-neutral-100 rounded-full h-2.5 mb-6">
              <div 
                className="bg-primary-600 h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${(currentSectionIndex / (ASSESSMENT_SECTIONS[language].length - 1)) * 100}%` }}
              ></div>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">{currentSection.title}</h1>
            <p className="text-neutral-600">{currentSection.description}</p>
          </div>
          
          {currentSection.type === 'intro' && (
            <div className="card p-6 mb-8">
              <h3 className="text-lg font-medium text-neutral-800 mb-4">Before you begin:</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary-600" />
                  </span>
                  <span className="text-neutral-600">
                    Find a quiet place where you can focus without interruptions.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary-600" />
                  </span>
                  <span className="text-neutral-600">
                    Answer honestly - there are no right or wrong answers.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary-600" />
                  </span>
                  <span className="text-neutral-600">
                    Consider how you've felt over the past two weeks, not just today.
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-primary-600" />
                  </span>
                  <span className="text-neutral-600">
                    Your responses are confidential and will only be used to provide personalized recommendations.
                  </span>
                </li>
              </ul>
            </div>
          )}
          
          {currentSection.type === 'completion' && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 rounded-full mb-6">
                <Check className="h-10 w-10 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                Thank You for Completing the Assessment
              </h2>
              <p className="text-neutral-600 mb-8 max-w-md mx-auto">
                Your responses have been recorded. We've created a personalized dashboard 
                with insights and recommendations based on your assessment.
              </p>
              <button
                type="button"
                className="btn btn-primary px-8 py-3"
                onClick={handleComplete}
              >
                View Your Results
              </button>
            </div>
          )}
          
          {currentSection.questions && (
            <div>
              {currentSection.questions.map(question => renderQuestion(question))}
            </div>
          )}
          
          {(currentSection.type !== 'completion') && (
            <div className="flex justify-between mt-8">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNext}
                disabled={!isCurrentSectionComplete()}
              >
                {currentSectionIndex === ASSESSMENT_SECTIONS[language].length - 2 ? 'Complete' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Assessment;
