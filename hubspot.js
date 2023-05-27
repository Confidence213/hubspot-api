require('dotenv').config()

const express = require('express')
const axios = require('axios')

const app = express()

const HUBSPOT_API_KEY = process.env.HUBSPOT_API_KEY

exports.createContacts = async (req, res) => {
  const email = req.body.email
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const endPoints = "https://api.hubspot.com/crm/v3/objects/contacts"
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json'
  }
  const body = {
    properties: {
      email: email,
      firstname: firstName,
      lastname: lastName,
      trial_account_created: true,
      episode_credits_used: 0
    }
  }

  try{
    const resp = await axios.post(endPoints, body, { headers })
    const result = resp.data
    res.render(result.trial_account_created, result.createdate)
    console.log("HubSpot New Contact is Created at: ", result.createdate)
  } catch(err) {
    console.error(err)
  }
}

exports.accountVerified = async (req, res) => {
  const email = req.body.email
  const endPoints = `https://api.hubspot.com/crm/v3/objects/contacts/${email}?idProperty=email`
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json'
  }
  const body = {
    properties: {
      account_verified: true
    }
  }

  try{
    await axios.patch(endPoints, body, { headers })
    console.log("Account is successfully verified!")
  } catch(err) {
    console.error(err)
  }
}

exports.episodeUsedDate = async (req, res) => {
  const email = req.body.email
  const date = Date.now()
  const endPoints = `https://api.hubspot.com/crm/v3/objects/contacts/${email}?idProperty=email`
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json'
  }
  const body = {
    properties: {
      trial_episode_used_date: date.toISOString()
    }
  }

  try{
    const resp = await axios.patch(endPoints, body, { headers })
    const result = resp.data
    res.render(result.trial_episode_used_date)
    console.log("Episode is Used at: ", trial_episode_used_date)
  } catch(err) {
    console.error(err)
  }
}

exports.subscriptionPurchase = async (req, res) => {
  const email = req.body.email
  const date = Date.now()
  const planName = req.body.planName
  const endPoints = `https://api.hubspot.com/crm/v3/objects/contacts/${email}?idProperty=email`
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json'
  }
  const body = {
    properties: {
      subscription_purchased_date: date.toISOString(),
      subscription_plan_name: planName
    }
  }

  try{
    const resp = await axios.patch(endPoints, body, { headers })
    const result = resp.data
    console.log(result.subscription_plan_name, " is Purchased at: ", result.subscription_purchased_date)
  } catch(err) {
    console.error(err)
  }
}

exports.episodeCreditsUsed = async (req, res) => {
  const email = req.body.email
  const endPoints = `https://api.hubspot.com/crm/v3/objects/contacts/${email}?idProperty=email`
  const headers = {
    Authorization: `Bearer ${HUBSPOT_API_KEY}`,
    'Content-Type': 'application/json'
  }
  try{
    const resp1 = await axios.get(endPoints, { headers })
    const result1 = resp1.data
    console.log(result1.firstname, "'s data is loaded")
    const body = {
      properties: {
        episode_credits_used: result1.episode_credits_used + 1
      }
    }
    try{
      const resp = await axios.patch(endPoints, body, { headers })
      const result = resp.data
      res.render(result.episode_credits_used)
    } catch (err1) {
      console.error(err1)
    }
  } catch(err) {
    console.error(err)
  }
}

app.listen(3001, () => console.log('Listening on http://localhost:3001'))