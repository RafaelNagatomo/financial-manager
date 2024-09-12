import { useState, useCallback, createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import useCustomToast from '../hooks/useCustomToast';
import { useCategories, Category } from '../contexts/CategoryContext'
import { useAuth } from '../contexts/AuthContext'
import { getAuthHeaders } from '../utils/getAuthHeaders'
import api from '../utils/api';

export interface Goal {
  id?: number;
  goal_name?: string;
  goal_description?: string;
  goal_amount?: number;
  amount_raised?: number;
  goal_image?: string;
  goal_date?: string | null;
}

interface GoalContextProps {
  goals: Goal[];
  fetchGoals: () => Promise<void>;
  addGoal: (goal: Omit<Goal, 'id'>, goalImageFile?: File) => Promise<void>;
  deleteGoal: (goal: Goal) => Promise<void>;
  editGoal: (goal: Goal) => Promise<void>;
}

const GoalContext = createContext<GoalContextProps | undefined>(undefined);

export const GoalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  const { shortToast } = useCustomToast();
  const [goals, setGoals] = useState<Goal[]>([]);
  const { categories, fetchCategories } = useCategories();
  const { user } = useAuth();

  const fetchGoals = useCallback(async () => {
    try {
      const response = await api.get('/goals/', {
        headers: getAuthHeaders(),
        params: { userId: user?.id }
      });
      const goalsResponse = response.data;

      if (goalsResponse.length === 0) {
        const categoriesResponse = await api.get('/categories/', {
          headers: getAuthHeaders(),
          params: { userId: user?.id }
        });
        const categories = await categoriesResponse.data;
    
        const goalCategory = categories.find((cat: Category) => cat.category_name === 'goals');
        if (goalCategory) {
          await api.delete(`/categories/delete/${goalCategory.id}`, {
            headers: getAuthHeaders(),
          });
        }
      } else {
        const updatedGoals = goalsResponse.map((goal: Goal) => ({
          ...goal,
          goal_image: goal.goal_image ? `${process.env.REACT_APP_API_URL}/uploads/${goal.goal_image}` : '',
        }));
        console.log('************', process.env.REACT_APP_API_BASE_URL)
        setGoals(updatedGoals);
      }
    } catch (error) {
      shortToast(t('Erro ao buscar metas ou categorias:') + `${error}`, 'error');
    }
  }, []);

  const addGoal = async (goal: Omit<Goal, 'id'>) => {
    try {
      if (goals.length === 0) {
        let categoryExists = categories.some(cat => cat.category_name === 'goals');

        if (!categoryExists) {
          await api.post('/categories/add', {
              user_id: user?.id,
              category_name: 'goals',
              max_amount: null
          }, {
            headers: getAuthHeaders(),
          });
          await fetchCategories();
        }
      }
      const formData = new FormData();
        formData.append('user_id', user?.id || '');
        formData.append('goal_name', goal.goal_name || '');
        formData.append('goal_description', goal.goal_description || '');
        formData.append('goal_amount', goal.goal_amount ? goal.goal_amount.toString() : '0');
        formData.append('amount_raised', goal.amount_raised?.toString() || '0');
        formData.append('goal_date', goal.goal_date ? new Date(goal.goal_date).toISOString() : '');
        formData.append('goal_image', goal.goal_image || '');

      const response = await api.post('/goals/add', formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        fetchGoals();
        shortToast(t('goalAddedSuccessfully'), 'success');
      } else {
        const errorText = await response.data
        shortToast(t('failedToAddGoal') + `${errorText}`, 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const deleteGoal = async (goal: Goal) => {
    try {
      const response = await api.delete(`/goals/delete/${goal.id}`, {
        headers: getAuthHeaders(),
      });

      if (response.status === 200) {
        setGoals(goals.filter(item => item.id !== goal.id));
        shortToast(t('successfullyDeleted'), 'success');
        fetchGoals()
      } else {
        shortToast(t('failedToDelete'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  const editGoal = async (goal: Goal) => {
    const formData = new FormData();
    formData.append('user_id', user?.id || '');
    if (goal.goal_name) {
      formData.append('goal_name', goal.goal_name);
    }
    if (goal.goal_description) {
      formData.append('goal_description', goal.goal_description);
    }
    if (goal.goal_amount !== undefined && goal.goal_amount !== null) {
      formData.append('goal_amount', goal.goal_amount.toString());
    }
    if (goal.amount_raised !== undefined && goal.amount_raised !== null) {
      formData.append('amount_raised', goal.amount_raised.toString());
    }
    if (goal.goal_date) {
      formData.append('goal_date', new Date(goal.goal_date).toISOString());
    }
    if (goal.goal_image) {formData.append('goal_image', goal.goal_image)}

      try {
        const response = await api.put(`/goals/edit/${goal.id}`, formData, {
          headers: {
            ...getAuthHeaders(),
            'Content-Type': 'multipart/form-data',
          },
        });

      if (response.status === 200) {
        fetchGoals();
        shortToast(t('goalEditedSuccessfully'), 'success');
      } else {
        shortToast(t('failedToEditGoal'), 'error');
      }
    } catch (error) {
      shortToast(t('errorOccured') + `${error}`, 'error');
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        fetchGoals,
        addGoal,
        deleteGoal,
        editGoal,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
};

export const useGoals = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
};
