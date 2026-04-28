import {Text, Heading, View, Flex, Divider} from '@aws-amplify/ui-react';
import { useState } from "react";

export default function Information( { signinButton } ) {
  const [scanTarget, setScanTarget] = useState("");
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanLoading, setScanLoading] = useState(false);

  const handleScan = async () => {
    if (!scanTarget) return;

    setScanLoading(true);
    setScanResult(null);

    try {
      const res = await fetch("http://localhost:3000/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ target: scanTarget }),
      });

      const data = await res.json();
      setScanResult(data);
    } catch (err) {
      console.error(err);
    }

    setScanLoading(false);
  };

  return (
  <View as="div">
    <Flex direction="column" gap="1rem">

      {/* ADD SCAN SECTION HERE */}
      <div>
        <input
          value={scanTarget}
          onChange={(e) => setScanTarget(e.target.value)}
          placeholder="example.com"
        />

        <button onClick={handleScan}>Run Scan</button>

        {scanLoading && <p>Scanning...</p>}

        {scanResult && (
          <div>
            <p>Total: {scanResult.total}</p>
            <p>High: {scanResult.high}</p>
          </div>
        )}
      </div>
      {/* END SCAN SECTION */}

      {/* Existing content */}
      <Flex direction="row" justifyContent="center">
        <Heading level={1} fontWeight="bold">
          {"Welcome to ViD(istribute).io!"}
        </Heading>
      </Flex>

      <Divider orientation="horizontal" />

      <Flex direction="column" gap="3rem">
        <Flex direction="row" justifyContent="center">
          <Text>
            ViDistribute is your personal online private video library. Upload mp4 files and share them with others.
          </Text>
        </Flex>

        <Flex direction="row" justifyContent="center">
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
  );
}