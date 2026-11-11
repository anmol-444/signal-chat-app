import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";

function Homepage() {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxW="xl" centerContent py={{ base: 6, md: 12 }}>
      <Box className="signal-auth-shell">
        <Box className="signal-brand-row">
          <Box className="signal-brand-mark">S</Box>
          <Text className="signal-brand-name">Signal</Text>
          <Box className="signal-secondary-badge">Secure messaging</Box>
        </Box>

        <Box className="signal-auth-card">
          <Box className="signal-auth-header">
            <Text className="signal-welcome">Welcome</Text>
          </Box>

          <Tabs isFitted variant="unstyled">
            <TabList className="signal-tabs">
              <Tab className="signal-tab">Login</Tab>
              <Tab className="signal-tab">Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <Login />
              </TabPanel>
              <TabPanel p={0}>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
}

export default Homepage;
