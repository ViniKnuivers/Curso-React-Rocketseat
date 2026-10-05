import { HandPalm, Play } from 'phosphor-react';
import { use } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { CyclesContext } from '../../contexts/CyclesContext';
import { Countdown } from './components/Countdown';
import { NewCycleForm } from './components/NewCycleForm';
import { HomeContainer, StartCountdownButton, StopCountdownButton } from './styles';

interface NewCycleFormData {
  task: string;
  minutesAmount: number;
}

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = use(CyclesContext);

  const newCycleForm = useForm<NewCycleFormData>();
  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={(event) => void handleSubmit(handleCreateNewCycle)(event)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
