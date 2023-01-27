import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { addressContactSchema as schema } from '../../../../../../../forms/yup-schemas';
import onFormValueChange from '../../../../../../functions/onFormValueChange';

export const AddAddressStep = (props: { setFormValues: (updatedFormValues: any) => void, formValues: any, setAllowNext: (b: boolean) => void }) => {
  const { setFormValues, formValues, setAllowNext } = props;
  const { register, handleSubmit, watch, formState: { errors, isValid }, control } = useForm({
    mode: 'all',
    resolver: yupResolver(schema),
    defaultValues: formValues,
  });
  const handleFormValuesChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    fieldName: string,
    propertyName?: string) => {
    onFormValueChange(event, fieldName, formValues, setFormValues, propertyName);
  }, [formValues, setFormValues]);

  useEffect(() => {
    setAllowNext(isValid);
  }, [isValid]);

  return (
    <form style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <FormControl isInvalid={false} display={'flex'} justifyContent={'center'}>
        <FormErrorMessage>Please fill out all of the required fields</FormErrorMessage>
      </FormControl>
      <FormControl isRequired isInvalid={!!errors?.city?.message}>
        <FormLabel>City </FormLabel>
        <Input {...register('city')}
               defaultValue={formValues?.address?.city}
               onChange={e => handleFormValuesChange(e, 'city')} required
               placeholder='City'
               type={'text'} />
        <FormErrorMessage>{errors?.city?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.state?.message}>
        <FormLabel>State </FormLabel>
        <Input {...register('state')}
               defaultValue={formValues?.address?.state}
               onChange={e => handleFormValuesChange(e, 'state')} required
               placeholder='State'
               type={'text'} />
        <FormErrorMessage>{errors?.state?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.country?.message}>
        <FormLabel>Country code </FormLabel>
        <Input {...register('country')}
               defaultValue={formValues?.address?.country}
               onChange={e => handleFormValuesChange(e, 'country')} required
               placeholder='Country'
               type={'text'} />
        <FormErrorMessage>{errors?.country?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.postal_code?.message}>
        <FormLabel>Postal Code </FormLabel>
        <Input {...register('postal_code')}
               defaultValue={formValues?.address?.postal_code}
               onChange={e => handleFormValuesChange(e, 'postal_code')} required
               placeholder='00-000'
               type={'text'} />
        <FormErrorMessage>{errors?.postal_code?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.street?.message}>
        <FormLabel>Street </FormLabel>
        <Input {...register('street')}
               defaultValue={formValues?.address?.street}
               onChange={e => handleFormValuesChange(e, 'street')} required
               placeholder='Street'
               type={'text'} />
        <FormErrorMessage>{errors?.street?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.email?.message}>
        <FormLabel>E-mail </FormLabel>
        <Input {...register('email')}
               defaultValue={formValues?.contact?.email}
               onChange={e => handleFormValuesChange(e, 'email')} required
               placeholder='Email'
               type={'email'} />
        <FormErrorMessage>{errors?.email?.message?.toString()}</FormErrorMessage>
      </FormControl>

      <FormControl isRequired isInvalid={!!errors?.phone_number?.message}>
        <FormLabel>Phone number </FormLabel>
        <Input {...register('phone_number')}
               defaultValue={formValues?.contact?.phone_number}
               onChange={e => handleFormValuesChange(e, 'phone_number')} required
               placeholder='Phone number'
               type={'text'} />
        <FormErrorMessage>{errors?.phone_number?.message?.toString()}</FormErrorMessage>
      </FormControl>

    </form>
  );
};
