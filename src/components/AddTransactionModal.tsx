import { useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Stack,
  Radio,
  LightMode,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';
import CategorySelect from './CategorySelect';
import { Transaction } from '../hooks/useTransactions'

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransactionAdded?: (transaction: Transaction) => void;
  onTransactionUpdated?: (transaction: Transaction) => void;
  transaction?: Transaction;
  fetchTransactions?: () => Promise<void>;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  onTransactionAdded,
  onTransactionUpdated,
  transaction,
  fetchTransactions
}) => {
  const { t } = useTranslation();
  const { control, handleSubmit, register, setValue, reset } = useForm<Transaction>({
    defaultValues: {
      transaction_type: transaction?.transaction_type || 'expense',
      transaction_name: transaction?.transaction_name || '',
      category_name: transaction?.category_name || '',
      transaction_amount: transaction?.transaction_amount || 0,
      expiration_date: transaction?.expiration_date || '',
      paid: transaction?.paid || false,
    }
  });


  useEffect(() => {
    if (transaction) {
      reset({
        transaction_type: transaction.transaction_type,
        transaction_name: transaction.transaction_name,
        category_name: transaction.category_name,
        transaction_amount: transaction.transaction_amount,
        expiration_date: transaction.expiration_date,
        paid: transaction.paid,
      });
    }
  }, [transaction, isOpen, reset]);

  const onSubmit = (data: Transaction) => {
    if (transaction && onTransactionUpdated) {
      onTransactionUpdated({ ...transaction, ...data });
    } else if (onTransactionAdded) {
      onTransactionAdded(data);
    }
    onClose();
    fetchTransactions?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
    >
      <ModalOverlay
        bg='blackAlpha.300'
        backdropFilter='blur(5px) hue-rotate(30deg)'
      />
      <ModalContent>
        <ModalHeader>{t('createNewTransaction')}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="add-transaction-form" onSubmit={handleSubmit(onSubmit)}>
            
            <FormControl as="fieldset" my={5}>
              <FormLabel as="legend">
                {t('type')}
              </FormLabel>
              <RadioGroup defaultValue="expense">
                <Stack spacing={4} direction="row">
                  <Radio
                    value="expense"
                    {...register("transaction_type", { required: true })}
                  >
                    {t('expense')}
                  </Radio>
                  <Radio
                    value="income"
                    {...register("transaction_type", { required: true })}
                  >
                    {t('income')}
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('title')}</FormLabel>
              <Input placeholder={t('insertTitle')} {...register("transaction_name", { required: true })} />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('category')}</FormLabel>
              <Controller
                name="category_name"
                control={control}
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <CategorySelect
                    value={value}
                    onChange={onChange}
                    placeholder={t('selectCategory')}
                  />
                )}
              />
            </FormControl>

            <FormControl isRequired my={5}>
              <FormLabel>{t('amount')}</FormLabel>
              <Controller
                name="transaction_amount"
                control={control}
                rules={{ required: t('thisFieldIsRequired') }}
                render={({ field }) => (
                  <NumberInput
                    min={0}
                    value={field.value || 0} 
                    onChange={(value) => field.onChange(Number(value))} 
                  >
                    <NumberInputField placeholder={t('amount')} type="number" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                )}
              />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('expirationDate')}</FormLabel>
              <Input type="date" {...register("expiration_date")} />
            </FormControl>

            <FormControl my={5}>
              <FormLabel>{t('paid')}</FormLabel>
              <LightMode>
                <Switch 
                  size="md" 
                  {...register("paid")}
                  onChange={(e) => setValue("paid", e.target.checked)}
                />
              </LightMode>
            </FormControl>

          </form>
        </ModalBody>

        <ModalFooter gap={6}>
          <CustomButton title={t('cancel')} variant='outline' onClick={onClose} />
          <CustomButton title={t('save')} type='submit' form='add-transaction-form' />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;
