import {  ScrollView, Switch, Text, TextInput, TouchableOpacity, View, Image }from 'react-native';
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg';
import { Link, useRouter } from 'expo-router';
import Icon from '@expo/vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { api } from '../src/lib/api';

export default function NewMemory() {

  const {bottom, top} = useSafeAreaInsets();
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState('');
  const [preview, setPreview] = useState<null | string>(null);
  const router = useRouter();

  async function openImagePicker(){
   try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    })
   
    if(result.assets[0]){
      setPreview(result.assets[0].uri)
    }
  
  } catch (err) {
    //deu erro mas eu nao tratei
  }

  }

  async function handleCreateMemory(){
  const token = await SecureStore.getItemAsync('token');

  let coverUrl = '';

  if(preview){
    const uploadFormData = new FormData()

    uploadFormData.append('file', {
      name: 'image.jpg',
      type: 'image/jpeg',
      uri: preview,
    } as any)

    const uploadResponse = await api.post('/upload', uploadFormData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    coverUrl = uploadResponse.data.fileUrl;
  }

  await api.post('/memories', {
    content,
    isPublic,
    coverUrl,
  },
  {
   headers:{
    Authorization: `Bearer ${token}`
   } 
  })

  router.push('/memories')

  }

  return (
    <ScrollView className='flex-1 px-8' contentContainerStyle={{paddingBottom: bottom, paddingTop: top}}>
        <View className='flex-row items-center justify-between mt-4'>
            <NLWLogo />
            <TouchableOpacity className="h-10 w-10 items-center rounded-full justify-center bg-purple-500">
                <Link href="/memories" asChild >
                    <Icon name="arrow-left" size={16} color="#FFF" />
                </Link>
            </TouchableOpacity>
        </View>

        <View className='mt-6 space-y-6'>
            <View className='flex-row items-center gap-2'>
                <Switch 
                 value={isPublic}
                 onValueChange={setIsPublic}
                 thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
                 trackColor={{false: '#767577', true: '#372560'}}
                />
                <Text className='font-body text-base text-gray-200'>Tornar memória pública</Text>
            </View>

            <TouchableOpacity 
            activeOpacity={0.7}             
            className='h-32 items-center justify-center rounded-lg border-dashed border-gray-500 bg-black/20'
            onPress={openImagePicker}
            >
              {preview ? <Image source={{ uri: preview}} className="h-full w-full rounded-lg object-cover" /> : (
                 <View className='flex-row items-center gap-2'>
                    <Icon name="image" color="#fff" /> 
                    <Text className='font-body text-sm text-gray-200'>Adicionar foto ou vídeo de capa</Text>
                </View>
              ) }
            </TouchableOpacity>

            <TextInput 
            multiline 
            className='p-0 font-body text-lg text-gray-50' 
            placeholder='Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre.' 
            placeholderTextColor="#56565a"
            value={content}
            onChangeText={setContent}
            textAlignVertical='top'
            />


            <TouchableOpacity
            className="rounded-full self-end bg-green-500 px-6 py-2"
            activeOpacity={0.7}
            onPress={handleCreateMemory}
            >
          <Text className="font-alt text-sm uppercase text-black">
            Salvar
          </Text>
        </TouchableOpacity>  
                 
            
        </View>
    </ScrollView>
  );
}