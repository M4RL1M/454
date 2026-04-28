import {Text, Heading, View, Flex, Divider, Card, Grid} from '@aws-amplify/ui-react';


function Information( { signinButton } ) {
  return(
    <View
      as="div"
    >
      <Flex
        direction="column"
        gap="1rem"
      >
        {/*Header flexbox*/}
        <Flex
          direction="row"
          justifyContent="center"
        >
          <Heading
            level={1}
            fontWeight="bold"
          >
            {"Welcome to ViD(istribute).io!"}
          </Heading>

        </Flex>

        <Divider orientation="horizontal" />

        <Flex
          direction="column"
          gap="3rem"
        >
          <Flex
            direction="row"
            justifyContent="center"
          >
            <Text>ViDistribute is your personal online private video library. Upload mp4 files and share them with others.</Text>
          </Flex>
          <Flex
            direction="row"
            justifyContent="center"
          >
            <View
              as="div"
              borderRadius="6px"
              border="1px solid black"
              boxShadow="1px 1px 3px 4px var(--amplify-colors-neutral-60)"
            >
              {signinButton}
            </View>
          </Flex>
        </Flex>
      </Flex>


    </View>
  )
}

export default Information;