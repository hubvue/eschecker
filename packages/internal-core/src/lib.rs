#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use std::collections::HashMap;

use napi::{bindgen_prelude::*, JsUnknown, Result};

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

#[napi]
#[derive(Debug)]
pub struct Source {
  pub path: Option<String>,
  pub content: Option<String>,
}

impl FromNapiValue for Source {
  unsafe fn from_napi_value(env: sys::napi_env, napi_val: sys::napi_value) -> Result<Self> {
    let obj = unsafe { Object::from_napi_value(env, napi_val)? };
    let mut path = None;
    if let Some(val) = obj.get::<&str, String>("path")? {
      path = Some(val);
    }
    let mut content = None;
    if let Some(val) = obj.get::<&str, String>("content")? {
      content = Some(val);
    }
    Ok(Source { path, content })
  }
}

#[napi]
#[derive(Debug)]
pub struct Config {
  #[napi(js_name = "esVersion")]
  pub es_version: Option<u32>,
  pub rules: HashMap<String, String>,
}

impl FromNapiValue for Config {
  unsafe fn from_napi_value(env: sys::napi_env, napi_val: sys::napi_value) -> Result<Self> {
    let obj = unsafe { Object::from_napi_value(env, napi_val)? };
    let mut es_version = None;
    if let Some(val) = obj.get::<&str, u32>("esVersion")? {
      es_version = Some(val);
    }

    let mut rules = HashMap::new();
    if let Some(val) = obj.get::<&str, HashMap<String, String>>("rules")? {
      rules = val;
    }
    Ok(Config { es_version, rules })
  }
}

#[napi]
pub fn eschecker(sources: Vec<Source>, config: Config) -> Option<JsUnknown> {
  println!("sources: {:?}", sources);
  println!("config: {:?}", config);
  None
}
