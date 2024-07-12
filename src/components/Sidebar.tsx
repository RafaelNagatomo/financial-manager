import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Flex,
  VStack,
  Text,
  Image,
  Icon,
  Button,
  LightMode,
  useColorMode,
} from '@chakra-ui/react';

import { RiDashboardHorizontalLine } from "react-icons/ri"
import { BiTransferAlt } from "react-icons/bi"
import { PiCrown } from "react-icons/pi"
import { IoSettingsOutline } from "react-icons/io5"
import { BiLogOut } from "react-icons/bi"

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const { colorMode } = useColorMode()

  const menuItems = [
    {
      route: "/dashboard",
      label: t('dashboard'),
      icon: RiDashboardHorizontalLine
    },
    {
      route: "/transactions",
      label: t('transactions'),
      icon: BiTransferAlt
    },
    {
      route: "/goals",
      label: t('goals'),
      icon: PiCrown
    },
    {
      route: "/settings",
      label: t('settings'),
      icon: IoSettingsOutline
    },
  ];

  const handleMenuItemClick = (label: string) => setActiveItem(label);

  return (
    <Box
      layerStyle={colorMode}
      w="220px"
      h="100vh"
      p={4}
      fontWeight='bold'
    >
      <Logo />
      <Menu
        menuItems={menuItems}
        activeItem={activeItem}
        onMenuItemClick={handleMenuItemClick}
      />
      <LogoutButton />
    </Box>
  );
};

const Logo: React.FC = () => (
  <Image mt={4} mb={12} src='/logos/logo.png' alt='FiManager-logo'/>
);

const Menu: React.FC<{
  menuItems: { route: string; label: string; icon: any }[];
  activeItem: string | null;
  onMenuItemClick: (label: string) => void;
}> = ({ menuItems, activeItem, onMenuItemClick }) => (
  <VStack spacing={4} align="stretch">
    {menuItems.map((item, index) => (
      <Link to={item.route} key={index} onClick={() => onMenuItemClick(item.label)}>
        <MenuItem item={item} isActive={activeItem === item.label} />
      </Link>
    ))}
  </VStack>
);

const MenuItem: React.FC<{
  item: { route: string; label: string; icon: any };
  isActive: boolean
}> = ({ item, isActive }) => (
  <Flex
    position="relative"
    align="center"
    p={1}
    borderRadius="md"
    _hover={{ color: "purple.500" }}
  >
    {item.icon && <Icon as={item.icon} boxSize={6} mr={2} color={isActive ? 'purple.500' : ''} />}
    <Text fontSize="lg" color={isActive ? 'purple.500' : ''}>{item.label}</Text>
    {isActive &&
      <Box
        position="absolute"
        right={-4}
        w={1}
        h={10}
        bg="purple.400"
        borderBottomLeftRadius={10}
        borderTopLeftRadius={10}
      />
    }
  </Flex>
);

const LogoutButton: React.FC = () => (
  <Flex mt={500} width='100%'>
    <Link to="/login" style={{ width: 200 }}>
      <LightMode>
        <Button
          justifyContent="start"
          width='100%'
          variant="outline"
          _hover={{ bg: 'purple.500', color: 'white', border: 'none' }}
          leftIcon={<BiLogOut size={18} style={{ marginRight: 30 }} />}
        >
          Log out
        </Button>
      </LightMode>
    </Link>
  </Flex>
);

export default Sidebar;