'use client'

import { useForm } from "react-hook-form"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'

const Home = () => {

  const schema = yup.object({
    name: yup
      .string()
      .label('名前')
      .trim()  // 前後の空白を除去
      .lowercase()  // 小文字に変換
      .transform((value, orgValue) => value.normalize('NFKC'))  // value: ここまでの変換済みの入力値, orgValue: 下の入力値
      .required('${label}は必須入力です')
      .max(6, '${label}は${max}文字以内で入力してください'),
    gender: yup
      .string()
      .label('性別')
      .required('${label}は必須入力です'),
    email: yup
      .string()
      .label('メールアドレス')
      .required('${label}は必須入力です')
      .email('${label}の形式が不正です'),
    memo: yup
      .string()
      .label('備考')
      .required('${label}は必須入力です')
      .test(  // test(検証名, 検証メッセージ, 検証ルール)
        'ng',
        ({ label }) => `${label}にNGワードが含まれています`,
        value => {
          const ngs = ['暴力', '自殺']
          for (const ng of ngs) {
            if (value.includes(ng)) {
              return false
            }
          }
          return true
        }
      )
      .min(10, '${label}は${min}文字以上で入力してください')
  })

  const { register, handleSubmit, formState: { errors, isValid, isSubmitting, isSubmitted } } = useForm({ resolver: yupResolver(schema), mode: 'onChange' })

  function onsubmit(data) {
    return new Promise(resolve => {  // submit時にダミーの遅延処理
      setTimeout(() => {
        resolve()
        console.log(data)
      }, 1000)
    })
  }
  function onerror(err) {
    console.log(err)
  }

  return (
    <div className="w-fit mx-auto my-4">
      <h2 className="mb-4 text-center">React Hook Form with Yup</h2>
      <form onSubmit={handleSubmit(onsubmit, onerror)} noValidate>
        <label>名前:
          <input type="text" {...register('name')}
            className="w-full border border-black px-1" />
          <p className="text-red-600">{errors.name?.message}</p>
        </label>
        <label>性別:
          <label>
            <input type="radio" value="male" {...register('gender')} />男性
          </label>
          <label>
            <input type="radio" value="female" {...register('gender')} />女性
          </label>
          <p className="text-red-600">{errors.gender?.message}</p>
        </label>
        <label>Eメール:
          <input type="email" {...register('email')} className="w-full border border-black px-1" />
          <p className="text-red-600">{errors.email?.message}</p>
        </label>
        <label>
          備考:
          <textarea {...register('memo')}
            className="w-full border border-black px-1"></textarea>
          <p className="text-red-600">{errors.memo?.message}</p>
        </label>
        <button disabled={isSubmitting} className="block my-1 w-full border border-black px-1 disabled:opacity-30">{isSubmitting ? '送信中...' : '送信する'}</button>
        <p className="text-center">{isSubmitted && 'コンソールに送信しました！'}</p>
      </form>
    </div>
  )
}

export default Home