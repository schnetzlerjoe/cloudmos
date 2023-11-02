import React, { useEffect } from "react";
import Router from "next/router";
import NProgress from "nprogress"; //nprogress module
import "nprogress/nprogress.css"; //styles of nprogress
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "@src/utils/createEmotionCache";
import { ColorModeProvider } from "@src/context/CustomThemeContext";
import { CustomSnackbarProvider } from "@src/context/CustomSnackbarProvider";
import { AppProps } from "next/app";
import withDarkMode from "next-dark-mode";
import "../styles/index.css";
import { QueryClientProvider } from "react-query";
import { queryClient } from "@src/queries";
import { WalletProvider } from "@src/context/WalletProvider";
import { PricingProvider } from "@src/context/PricingProvider/PricingProvider";
import { BackgroundTaskProvider } from "@src/context/BackgroundTaskProvider";
import { SettingsProvider } from "@src/context/SettingsProvider";
import { CertificateProvider } from "@src/context/CertificateProvider";
import { TemplatesProvider } from "@src/context/TemplatesProvider";
import { LocalNoteProvider } from "@src/context/LocalNoteProvider";
import { isProd } from "@src/utils/constants";
import { GoogleAnalytics } from "nextjs-google-analytics";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { AddressBookProvider } from "@src/context/AddressBookProvider";
import { Provider } from "jotai";
import { usePreviousRoute } from "@src/hooks/usePreviousRoute";
import { PageHead } from "@src/components/layout/PageHead";
import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplr } from "@cosmos-kit/keplr";
import { wallets as leap } from "@cosmos-kit/leap-extension";
import { wallets as cosmostation } from "@cosmos-kit/cosmostation";
import { chains, assets } from "chain-registry";

import "@interchain-ui/react/styles";
import { customRegistry } from "@src/utils/customRegistry";
import { GasPrice } from "@cosmjs/stargate";

interface Props extends AppProps {
  emotionCache?: EmotionCache;
}

NProgress.configure({
  minimum: 0.2
});

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

const App: React.FunctionComponent<Props> = ({ Component, pageProps, emotionCache = clientSideEmotionCache }) => {
  usePreviousRoute();

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // Fix for nivo line chart
    // https://github.com/plouc/nivo/issues/2162#issuecomment-1467184517
    (HTMLCanvasElement.prototype as any).getBBox = function () {
      return { width: this.offsetWidth, height: this.offsetHeight };
    };
  }, []);

  return (
    <>
      <PageHead />

      <CacheProvider value={emotionCache}>
        <QueryClientProvider client={queryClient}>
          <Provider>
            <ColorModeProvider>
              <CustomSnackbarProvider>
                <PricingProvider>
                  <UserProvider>
                    <AddressBookProvider>
                      <SettingsProvider>
                        <ChainProvider
                          chains={chains.filter(x => x.chain_name === "akash")}
                          assetLists={assets.filter(x => x.chain_name === "akash")}
                          wallets={[...keplr, ...leap, ...cosmostation]}
                          walletConnectOptions={{
                            signClient: {
                              projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
                            }
                          }}
                          signerOptions={{
                            preferredSignType: chain => "direct",
                            signingStargate: chain => ({
                              registry: customRegistry,
                              gasPrice: GasPrice.fromString("0.025uakt")
                            })
                          }}
                        >
                          <WalletProvider>
                            <CertificateProvider>
                              <TemplatesProvider>
                                <LocalNoteProvider>
                                  <BackgroundTaskProvider>
                                    {isProd && <GoogleAnalytics />}
                                    <Component {...pageProps} />
                                  </BackgroundTaskProvider>
                                </LocalNoteProvider>
                              </TemplatesProvider>
                            </CertificateProvider>
                          </WalletProvider>
                        </ChainProvider>
                      </SettingsProvider>
                    </AddressBookProvider>
                  </UserProvider>
                </PricingProvider>
              </CustomSnackbarProvider>
            </ColorModeProvider>
          </Provider>
        </QueryClientProvider>
      </CacheProvider>
    </>
  );
};

export default withDarkMode(App);
