#![deny(clippy::all)]

#[macro_use]
extern crate napi_derive;

use napi::{
  bindgen_prelude::*, Error, JsArrayBuffer, JsArrayBufferValue, JsNumber, JsObject, JsString,
  JsTypedArray, JsUnknown, Result,
};

#[napi]
pub fn sum(a: i32, b: i32) -> i32 {
  a + b
}

struct Source {
  path: JsString,
  content: JsString,
}

struct Config {
  esVersion: JsNumber,
  rules: JsArrayBuffer,
}

#[napi]
pub fn eschecker(sources: Array, config: Object) -> Option<JsUnknown> {
  let test = sources.get::<JsFunction>(0);
  if let Ok(Some(t)) = test {
    let res = t.call::<JsNumber>(None, &[]).ok()?;
    return Some(res);
  }
  None
}
