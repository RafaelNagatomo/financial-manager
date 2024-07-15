import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6'
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Spacer,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  useColorMode,
  useDisclosure
} from '@chakra-ui/react';
import { TransactionTable, SpendingByCategoryTable, UpcomingPaymentsTable } from './TransactionsTables'
import FilterButton from '../../components/FilterButton'
import CustomButton from '../../components/CustomButton';
import AddCategoryModal from '../../components/AddCategoryModal';
import AddTransactionModal from '../../components/AddTransactionModal';

const Transactions: React.FC = () => {
  const { t } = useTranslation();
  
  const initialTransactions = [
    {
      description: 'Groceries',
      category: 'Food',
      tag: 'Necessity',
      paid: true,
      amount: 50,
    },
    {
      description: 'Movie Ticket',
      category: 'Entertainment',
      tag: 'Leisure',
      paid: false,
      amount: 15,
    },
  ];

  const initialSpendingByCategory = [
    {
      description: 'Food',
      maxAmount: 200,
      progress: 30,
    },
    {
      description: 'Entertainment',
      maxAmount: 80,
      progress: 80,
    },
  ];

  const initialupcomingPayments = [
    {
      description: 'Food',
      amount: 25,
      expirateDate: '20-12-2024',
    },
    {
      description: 'Entertainment',
      amount: 87,
      expirateDate: '20-12-2024',
    },
  ];

  const [transactions] = useState(initialTransactions);
  const [spendingByCategory] = useState(initialSpendingByCategory);
  const [upcomingPayments] = useState(initialupcomingPayments);
  const { colorMode }  = useColorMode()
  const [changeTabCategory, setChangeTabCategory] = useState<boolean>(false);
  
  const { isOpen: isOpenCategory, onOpen: onOpenCategory, onClose: onCloseCategory } = useDisclosure()
  const { isOpen: isOpenTransaction, onOpen: onOpenTransaction, onClose: onCloseTransaction } = useDisclosure()


  return (
    <HStack gap={5} align='stretch'>
      <Card layerStyle={colorMode}>
        <CardHeader>
          <Flex gap='2'>
            <Heading
              as="h1"
              size="lg"
              display="flex"
              alignItems="center"
            >
              {t('transactions')}
            </Heading>
            <Spacer />
            <FilterButton />
            <CustomButton
              leftIcon={<FaPlus/>}
              title={changeTabCategory ? t('newCategory') : t('newTransaction')}
              onClick={changeTabCategory ? onOpenCategory : onOpenTransaction}
            />
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed">

            <TabList fontWeight='bold' w='95%' ml={5}>
              <Tab
                 _selected={{
                  color: 'purple.500',
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100'
                }}
                onClick={() => setChangeTabCategory(false)}
              >
                  {t('transactions')}
              </Tab>
              <Tab
                _selected={{
                  color: 'purple.500',
                  bg: colorMode === 'dark' ? 'gray.700' : 'gray.100'
                }}
                onClick={() => setChangeTabCategory(true)}
              >
                  {t('spendingByCategory')}
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <TransactionTable transactions={transactions} t={t} />
              </TabPanel>
              <TabPanel>
                <SpendingByCategoryTable spendingByCategory={spendingByCategory} t={t} />
              </TabPanel>
            </TabPanels>

          </Tabs>
        </CardBody>
      </Card>

      <Card layerStyle={colorMode}>
        <CardHeader>
          <Flex>
            <Heading
              as="h1"
              size="lg"
            >
              {t('upcomingPayments')}
            </Heading>
            <Spacer />
            <FilterButton />
          </Flex>
        </CardHeader>

        <CardBody>
          <Tabs variant="enclosed">

            <TabPanels>
              <TabPanel>
                <UpcomingPaymentsTable upcomingPayments={upcomingPayments} t={t} />
              </TabPanel>
            </TabPanels>

          </Tabs>
        </CardBody>
      </Card>
      <AddCategoryModal isOpen={isOpenCategory} onClose={onCloseCategory}/>
      <AddTransactionModal isOpen={isOpenTransaction} onClose={onCloseTransaction}/>
    </HStack>
  );
};

export default Transactions;
