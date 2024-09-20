import path from "path";
import { fileURLToPath } from "url";

import { BrowserContext, chromium, expect, Page, test } from "@playwright/test";
import { MetamaskExtensionPage } from "./pom";
import { getOtherAssets } from "@paraspell/sdk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const metamaskExtensionPath = path.join(
  __dirname,
  "extensions",
  "metamask-ext"
);

const metamaskAccount = {
  mnemonic:
    "leg observe column teach until outside since school october dinner impact title",
  password: "1234qwerty",
  ethAddress: "0xbbb10bb8048630bc30c8f33c5c96ac9577990c16",
};

const baseUiTest = test.extend({
  context: async ({}, use) => {
    const launchOptions = {
      devtools: false,
      headless: false,
      args: [
        `--disable-extensions-except=${metamaskExtensionPath}`,
        `--load-extension=${metamaskExtensionPath}`,
      ],
    };
    const context = await chromium.launchPersistentContext("", launchOptions);
    await use(context);
  },
});

const setupMetamaskExtension = async (context: BrowserContext) => {
  const appPage = await context.newPage();
  await appPage.goto("/");
  await appPage.waitForTimeout(2000);
  // Close Metamask welcome page
  context.pages()[2].close();
  const extensionPage = new MetamaskExtensionPage(await context.newPage());
  await extensionPage.connectAccountByExtension(
    metamaskAccount.mnemonic,
    metamaskAccount.password
  );

  await appPage.bringToFront();

  await appPage.goto("/xcm-sdk-sandbox");

  await appPage.getByTestId("tab-eth-bridge").click();

  await appPage.getByTestId("btn-connect-eth-wallet").click();

  await extensionPage.page.bringToFront();
  await extensionPage.reload();
  await extensionPage.connectToTheSite();
  await appPage.waitForTimeout(2000);
  await appPage.bringToFront();
  return { appPage };
};

const performTransfer = async (
  appPage: Page,
  { useApi, currency }: { useApi: boolean; currency: string }
) => {
  await appPage.getByTestId("select-currency").click();

  await appPage.getByRole("option", { name: currency }).click();

  if (useApi) {
    await appPage.getByTestId("checkbox-api").click();
  }

  await appPage.getByTestId("submit").click();
  await appPage.waitForSelector("[data-testid=error]");

  await expect(appPage.getByTestId("error")).toBeVisible();
  await expect(appPage.getByTestId("error")).toContainText(
    "Failed to validate send: ERC20 token balance insufficient for transfer."
  );
  await expect(appPage.getByTestId("error")).toContainText(
    "Insufficient ETH balance to pay fees."
  );
  await expect(appPage.getByTestId("error")).toContainText(
    "Beneficiary does not hold existential deposit on destination."
  );
  await expect(appPage.getByTestId("output")).not.toBeVisible();
};

baseUiTest.describe("XCM SDK - ETH Bridge", () => {
  let appPage: Page;

  const currencies = getOtherAssets("Ethereum").map(
    (asset) => asset.symbol
  ) as string[];

  // Test every other currency to avoid hitting the rate limit on Ethereum RPC node
  const filteredCurrencies = currencies.filter(
    (_, index) => index === 0 || index % 2 === 1
  );

  baseUiTest.beforeAll(async ({ context }) => {
    ({ appPage } = await setupMetamaskExtension(context));
  });

  baseUiTest.beforeEach(async () => {
    await appPage.goto("/xcm-sdk-sandbox");
    await appPage.getByTestId("tab-eth-bridge").click();
    await appPage.getByTestId("btn-connect-eth-wallet").click();
  });

  filteredCurrencies.forEach((currency) => {
    baseUiTest(
      `Should transfer ${currency} from Ethereum to Polkadot`,
      async () => {
        await performTransfer(appPage, { useApi: false, currency });
      }
    );

    baseUiTest(
      `Should transfer ${currency} from Polkadot to Ethereum - API`,
      async () => {
        await performTransfer(appPage, { useApi: true, currency });
      }
    );
  });
});
