import { useEffect } from "react";
import * as SecureStore from 'expo-secure-store';
import { Text, View, TouchableOpacity } from "react-native";
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg';
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { api } from "../src/lib/api";
import { useRouter } from 'expo-router';

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/9a426aba9bf424bea7b0',
};
export default function App() {

  const router = useRouter();


  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '9a426aba9bf424bea7b0',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      }),
    },
    discovery
  );


   async function handleGithubOauthCode(code : string){

    const response = await api.post('./register', {
      code,
    });

    const { token } = response.data;

    await SecureStore.setItemAsync('token', token);

    router.push('/memories') 
    
   } 


  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;

      handleGithubOauthCode(code);
    
    }
  }, [response]);
  


  return (
    <View className="flex-1 items px-8 py-10 center">
    
     {/* Content Logo & Text */}
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-boy text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        {/* Button */}
        <TouchableOpacity
          className="rounded-full bg-green-500 px-6 py-2"
          activeOpacity={0.7}
          onPress={() => signInWithGithub()}          
        >
          <Text className="font-alt text-sm uppercase text-black">
            Cadastrar Lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>

  
    </View>
  );
}
